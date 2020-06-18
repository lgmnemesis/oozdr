#!/bin/sh

helper() {
  echo
  echo "$0 PROJECT"
  echo " PROJECTS: ${projects[@]}"
  echo

  exit 0
}

echo ""
echo "Working directory: `pwd`"

opt1="$1"
projects=(app provisioning)
files=(app.module.ts app.component.ts app.component.html app.component.scss app-routing.module.ts)
filesPreffixDir='src/app'

if [ "${opt1}" == '-help' ] ||  [ "${opt1}" == '' ] ; then
  helper
fi

project=''
for i in "${projects[@]}"; do 
  if [ "${opt1}" == "${i}" ] ; then
    project=$i
  fi
done

if [ "${project}" == '' ] ; then
  echo "Project ${opt1} not exists!"
  helper
fi

for file in "${files[@]}"; do
  fileProj=`head -1 ${filesPreffixDir}/${file}`
  if [ "${fileProj}" == '' ] ; then
    echo "file ${file} is missing project header!!. exiting."
    exit 1
  fi
  header=`echo $fileProj|cut -f2 -d' '`
  pFile="${filesPreffixDir}/${file}-${header}"

  if [ -f "${pFile}" ] ; then
    good='1'
  else 
    echo "No such file: ${pFile}"
    echo "Aborting..."
    exit 1
  fi

  diff -w ${filesPreffixDir}/${file} $pFile > /dev/null
  rc=$?
  if [ ${rc} -ne 0 ] ; then
    echo "${filesPreffixDir}/${file} different from ${pFile}"
    echo "Saving changes..."
    cp ${filesPreffixDir}/${file} ${pFile}
    rc2=$?
    if [ ${rc2} -ne 0 ] ; then
      echo "Error cp ${filesPreffixDir}/${file} ${pFile}"
      echo "Aborting..."
      exit 1
    fi
  fi

  sFile="${filesPreffixDir}/${file}-${project}"
  echo "Copying ${sFile} to ${filesPreffixDir}/${file}"
  cp -f ${sFile} ${filesPreffixDir}/${file}

done

echo ""
echo "Project is set to ${project}"
