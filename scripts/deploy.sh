#!/bin/sh

helper() {
  echo
  echo "$0 production|staging|f|a [-d|-b|-v|-disable]"
  echo "   f: ${deployFunctions}"
  echo "   a: build with stats flag (--stats-json)"
  echo "      and run: webpack-bundle-analyzer"
  echo "  -b: build only (for production or staging)"
  echo "  -d: deploy hosting only, without a new build"
  echo "  -v: deploy with current version or with supplied 'version'"
  echo "  -disable:"
  echo "    for production: will run: firebase hosting:disable"
  echo "    for staging: will deploy a version with an 'empty' index.html file"
  echo

  exit 0
}

echo "Working directory: `pwd`"

deploy="$1"
options="$2"

buildProd="ionic build --prod -- --aot"
buildStaging="ionic build --prod --aot --configuration=staging -- --output-path=staging"
buildWithStats="${buildProd} --stats-json"
deployProduction="firebase deploy --only hosting:production"
# deployProduction="firebase deploy --only hosting"
deployStaging="firebase deploy --only hosting:staging"
deployFunctions="firebase deploy --only functions"
stagingAfterScript="./scripts/staging-after.sh"
stagingAfterScriptOptions=""
versionFile="./scripts/version.dat"
statsFile="www/stats-es2015.json"
versionIndFile='/tmp/version.ind'

if [ "${options}" == '-v' ] ; then
  echo 'current' > ${versionIndFile}
elif [ "${options}" == '-b' ] ; then
  echo "Building for ${deploy} - not deploying"
  deployProduction="echo"
  deployStaging="echo"
elif [ "${options}" == '-d' ] ; then
  buildProd="echo"
  buildStaging="echo"
  stagingAfterScriptOptions="deploy-only"
elif [ "${options}" == '-disable' ] ; then
  if [ "${deploy}" == 'production' ] ; then
    firebase hosting:disable
    exit
  elif [ "${deploy}" == 'staging' ] ; then
    echo "Deploying disable staging site"
    ${stagingAfterScript} disable && ${deployStaging}
    exit
  fi
elif [ "${options}" != '' ] ; then
  echo "${options} is not a valid option. exiting!"
  exit 1
fi

if [ "${deploy}" == '-help' ] ||  [ "${deploy}" == '' ] ; then
  helper
elif [ "${deploy}" == 'production' ] ; then
  echo "For production site"
  rm -f ${statsFile}
  echo "
    ${buildProd} && ${deployProduction}
  "
  ${buildProd} && ${deployProduction}
elif [ "${deploy}" == 'staging' ] ; then
  echo "For staging site"
  rm -f ${statsFile}
  echo "
    ${buildStaging} && 
    ${stagingAfterScript} enable ${stagingAfterScriptOptions} && 
    ${deployStaging}
  "

  ${buildStaging} && 
  ${stagingAfterScript} enable ${stagingAfterScriptOptions} && 
  ${deployStaging}
elif [ "${deploy}" == 'f' ] ; then
  echo "Deploying functions only"
  echo "${deployFunctions}"
  ${deployFunctions}
elif [ "${deploy}" == 'a' ] ; then
  echo "Running build with stats"
  ${buildWithStats}
  if [ $? -eq 0 ] ; then
    echo "Running webpack-bundle-analyzer"
    cmd="node_modules/webpack-bundle-analyzer/lib/bin/analyzer.js ${statsFile}"
    echo "# ${cmd}"
    ${cmd}
  fi
else 
  echo
  echo "Error: unknown option ${deploy}"
  helper
fi

if [ $? -eq 0 ] ; then
  echo
  echo 'Oozdr Version: '`cat ${versionFile}`
fi