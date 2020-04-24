#!/bin/sh

# version file format is major.minor.patch (eg: 2.0.0)
# to set the major or minor version with patch version set to 0,
# for example 2.1.0: 
# set the version to 2.1 in the version.dat file

export versionFile='./scripts/version.dat'
export envFile='./src/environments/environment.ts'
export envProdFile='./src/environments/environment.prod.ts'
export envStagingFile='./src/environments/environment.staging.ts'

bumpUp='true'

versionIndFile='/tmp/version.ind'
if [ -f "${versionIndFile}" ] ; then
  bumpUp='false'
  cat $versionIndFile|grep 'current' > /dev/null
  if [ $? -ne 0 ] ; then
    export versionFile=${versionIndFile}
  fi
fi

major=`cat $versionFile|cut -d. -f1`
minor=`cat $versionFile|cut -d. -f2`
patch=`cat $versionFile|cut -d. -f3`
version="${major}.${minor}.${patch}"
reg='^[0-9]+[.][0-9]+[.][0-9]*$'
if [[ $version =~ $reg ]] ; then
  if [[ $patch =~ ^[0-9]+$ ]] ; then
    if [ ${bumpUp} == 'true' ] ; then
      let patch=patch+1
    fi
  else 
    patch=0
  fi
  version="${major}.${minor}.${patch}"
  echo "Setting new client version: $version"
  echo $version > $versionFile

  cat $envFile|sed "s/clientVersion:.*/clientVersion: '${version}'/" > env.tmp
  mv -f env.tmp $envFile
  cat $envProdFile|sed "s/clientVersion:.*/clientVersion: '${version}'/" > env.tmp
  mv -f env.tmp $envProdFile
  cat $envStagingFile|sed "s/clientVersion:.*/clientVersion: '${version}'/" > env.tmp
  mv -f env.tmp $envStagingFile

  rm -f ${versionIndFile}

  # TMP: Removing all locales but EN from moment module
  echo "Removing all locales but EN from moment module"
  rm -f `find node_modules/moment/locale/*.js|grep -v en-`

  echo "copying node_modules/intl-tel-input/build/js/utils.js to src/assets/js/intl-tel-input"
  cp -f node_modules/intl-tel-input/build/js/utils.js src/assets/js/intl-tel-input/

fi
