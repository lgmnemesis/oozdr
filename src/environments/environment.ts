// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

function getFirebaseConfig() {
  return {
    apiKey: "AIzaSyBIc6xJd9MopPMgCATSHz4VLAUIsIyJae0",
    authDomain: "reconnect-i.firebaseapp.com",
    databaseURL: "http://localhost:4000/firestore",
    projectId: "reconnect-i",
    storageBucket: "reconnect-i.appspot.com",
    messagingSenderId: "15338544369",
    appId: "1:15338544369:web:870238a038bbc520561d50",
    measurementId: "G-XPLGQ5LX96"
  }
}

function getEmulatorConfig() {
  return {
    apiKey: "AIzaSyBIc6xJd9MopPMgCATSHz4VLAUIsIyJae0",
    authDomain: "reconnect-i.firebaseapp.com",
    databaseURL: "https://reconnect-i.firebaseio.com",
    projectId: "reconnect-i",
    storageBucket: "reconnect-i.appspot.com",
    messagingSenderId: "15338544369",
    appId: "1:15338544369:web:870238a038bbc520561d50",
    measurementId: "G-XPLGQ5LX96"
  }
}

export const environment = {
  production: false,
  get firebaseConfig() {
    return getConfig();
  },
  clientVersion: '2.0.125'
};

function isEmulator(): boolean {
  return false;
}

function getConfig() {
  if (isEmulator()) {
    return getEmulatorConfig();
  }
  return getFirebaseConfig();
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
