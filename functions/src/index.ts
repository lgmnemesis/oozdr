import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Sendgrid config
import * as sgMail from '@sendgrid/mail'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp()
const db = admin.firestore()

exports.matchConnection = functions.firestore
  .document('connections/{id}')
  .onCreate(async (snapshot, context) => {
    const connection: any = snapshot.data()

    if (
      !connection ||
      connection === undefined ||
      connection === null ||
      !connection.basicInfo ||
      !connection.basicInfo.mobile ||
      !connection.user_mobile ||
      connection.user_mobile === connection.basicInfo.mobile
    ) {
      return null
    }

    console.log('got data:', JSON.stringify(connection))

    // Find new connection to work on
    let secondPartyConnection: any = null
    const connectionsRef = db.collection('connections')
    const query = connectionsRef
      .where('basicInfo.mobile', '==', connection.user_mobile)
      .where('user_mobile', '==', connection.basicInfo.mobile)
    try {
      const qSnap = await query.get()
      qSnap.forEach((doc) => {
        const docData = doc.data()
        console.log('match1:', JSON.stringify(docData))
        if (docData.user_id !== connection.user_id) {
          secondPartyConnection = docData
        }
      })
    } catch (error) {
      console.error('Error getting documents:', error)
    }

    if (secondPartyConnection) {
      // We found a match
      console.log(
        'final match',
        ' myParty:',
        JSON.stringify(connection),
        ' secondParty:',
        JSON.stringify(secondPartyConnection),
      )

      const isClosure = connection.isClosure || secondPartyConnection.isClosure
      const myConnectionDocRef = db.doc(`connections/${connection.id}`)
      const secondConnectionDocRef = db.doc(
        `connections/${secondPartyConnection.id}`,
      )
      const matchId =
        connection.user_mobile > secondPartyConnection.user_mobile
          ? `${connection.user_mobile}_${secondPartyConnection.user_mobile}`
          : `${secondPartyConnection.user_mobile}_${connection.user_mobile}`
      const matchDocRef = db.doc(`matches/${matchId}`)

      const myConnectionParams: any = {
        isMatched: !isClosure,
        isNewMatch: !isClosure,
        match_user_id: !isClosure ? secondPartyConnection.user_id : '',
        match_id: !isClosure ? matchId : '',
        basicInfo: {
          profile_img_url: secondPartyConnection.user_profle_img_url,
        },
      }
      const secondConnectionParams: any = {
        isMatched: !isClosure,
        isNewMatch: !isClosure,
        match_user_id: !isClosure ? connection.user_id : '',
        match_id: !isClosure ? matchId : '',
        basicInfo: {
          profile_img_url: connection.user_profle_img_url,
        },
      }
      const matchParams: any = {
        id: matchId,
        firstParty: {
          user_id: connection.user_id,
          user_mobile: connection.user_mobile,
        },
        secondParty: {
          user_id: secondPartyConnection.user_id,
          user_mobile: secondPartyConnection.user_mobile,
        },
        participates: [connection.user_id, secondPartyConnection.user_id],
      }

      const messages = []
      if (secondPartyConnection.basicInfo.welcome_msg) {
        const message = {
          id: connectionsRef.doc('empty1').id,
          user_id: secondPartyConnection.user_id,
          match_id: matchId,
          content: secondPartyConnection.basicInfo.welcome_msg,
          createdAt: new Date().getTime(),
        }
        messages.push(message)
      }
      if (connection.basicInfo.welcome_msg) {
        const message = {
          id: connectionsRef.doc('empty2').id,
          user_id: connection.user_id,
          match_id: matchId,
          content: connection.basicInfo.welcome_msg,
          createdAt: new Date().getTime(),
        }
        messages.push(message)
      }
      matchParams.messages = messages

      if (isClosure) {
        console.log('we got closure')
        myConnectionParams.isClosureMatched = true
        secondConnectionParams.isClosureMatched = true
        myConnectionParams.otherParty = {
          isClosure: secondPartyConnection.isClosure,
          message: secondPartyConnection.basicInfo.welcome_msg,
        }
        secondConnectionParams.otherParty = {
          isClosure: connection.isClosure,
          message: connection.basicInfo.welcome_msg,
        }
      }

      console.log('preparing batch write')
      const batch = db.batch()
      batch.set(myConnectionDocRef, myConnectionParams, { merge: true })
      batch.set(secondConnectionDocRef, secondConnectionParams, { merge: true })
      if (!isClosure) {
        console.log('add match to batch write')
        batch.set(matchDocRef, matchParams, { merge: true })
      }
      try {
        console.log('before commit')
        await batch.commit()
        console.log('after commit')

        // Get second party profile in order to get its latest FCM tokens
        const secondPartyProfileRef = db.doc(
          `/profiles/${secondPartyConnection.user_id}`,
        )
        const secondPartyProfileDoc = await secondPartyProfileRef.get()
        if (secondPartyProfileDoc && secondPartyProfileDoc.exists) {
          const data = secondPartyProfileDoc.data()
          if (data) {
            const notificationsEnabled =
              data.settings.notifications === 'enabled'
            const secondPartyTokens: string[] = data.fcmTokens // Incase he is connected using several devices(desktop/mobile... other browsers...)
            if (
              notificationsEnabled &&
              secondPartyTokens &&
              secondPartyTokens.length > 0 &&
              secondPartyTokens.length <= 5
            ) {
              const name: string = secondPartyConnection.basicInfo.name
              const nameC: string = name[0].toUpperCase() + name.slice(1)
              const welcomeMsg: string = connection.basicInfo.welcome_msg
              let title: string, body: string
              if (welcomeMsg) {
                const etc = welcomeMsg.length > 100 ? '...' : ''
                title = `${nameC} is looking for you:`
                body = `"${welcomeMsg.substring(0, 100)}${etc}"`
              } else {
                title = "You've got a new match"
                body = `${nameC} is looking for you.`
              }
              await fcmSend(secondPartyTokens, title, body, 'match')
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      console.log('moshe no match')
      // check if connection has a profile
      let secondProfile: any = null
      const profilesRef = db.collection('profiles')
      const profileQuery = profilesRef.where(
        'basicInfo.mobile',
        '==',
        connection.basicInfo.mobile,
      )
      try {
        const pqSnap = await profileQuery.get()
        pqSnap.forEach((doc) => {
          secondProfile = doc.data()
        })
        if (secondProfile) {
          // Profile exists. Send a notification that someone was looking for him?
          console.log(
            `Found existing profile: ${secondProfile.basicInfo.mobile}, no match, ${connection.user_mobile} was looking for him.`,
          )

          const notificationsEnabled =
            secondProfile.settings.notifications === 'enabled'
          const secondPartyTokens: any[] = secondProfile.fcmTokens
          if (
            notificationsEnabled &&
            secondPartyTokens &&
            secondPartyTokens.length > 0 &&
            secondPartyTokens.length <= 5
          ) {
            const title = 'Someone is looking 4U'
            const body = `Do you know who it is? Can you guess? goto your Oozdr and find for yourself.`
            await fcmSend(secondPartyTokens, title, body, 'looking4u')
          }
        } else {
          if (connection.basicInfo.email) {
            console.log('Profile NOT found. sending an invitation email')
            await emailSend(
              connection.basicInfo.email,
              connection.basicInfo.name,
            )
          } else {
            // TODO: Should we send SMS if no email??
            console.log('Profile NOT found. no email. not sending anything')
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    console.log('last')
    return null
  })

const fcmSend = (tokens: any[], title: string, body: string, type: string) => {
  console.log('in fcmSend:')
  if (!tokens) {
    console.log('no token found')
    return null
  }

  console.log('tokens first:', JSON.stringify(tokens))

  const sTokens: string[] = []
  tokens.forEach((t) => {
    if (t.token) {
      sTokens.push(t.token)
    } else {
      sTokens.push(t)
    }
  })

  const payload = {
    notification: {
      title: title,
      body: body,
      icon: 'https://oozdr.com/assets/images/reconnect-logo.png',
      click_action: 'https://oozdr.com',
    },
    data: {
      type: type,
    },
  }
  console.log('tokens:', JSON.stringify(sTokens))
  return admin.messaging().sendToDevice(sTokens, payload)
}

const emailSend = (mailTo: string, name: string) => {
  const API_KEY = functions.config().sendgrid.key
  const TEMPLATE_ID = functions.config().sendgrid.template

  sgMail.setApiKey(API_KEY)

  const msg = {
    to: mailTo,
    from: 'Oozdr@oozdr.com',
    templateId: TEMPLATE_ID,
    dynamic_template_data: {
      name: name,
      subject: `Hi ${name}! People are looking for you on Oozdr`,
    },
  }

  console.log('mail sent with this message:', msg)
  return sgMail.send(msg)
}
