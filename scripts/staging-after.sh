#!/bin/sh

action="$1"
deployOnly="$2"
staging_dir="staging"
index="${staging_dir}/index.html"
indexFull="${staging_dir}/index.full"

if [ "${action}" != 'disable' ] && [ "${action}" != 'enable' ] ; then
  echo "Error: action must be [disable|enable]"
  echo "Exiting(staging-after.sh)"
  exit 1
fi

if [ "${action}" == 'enable' ] ; then
  echo "Running enable staging script"
  if [ "${deployOnly}" == 'deploy-only' ] ; then
    if [ -f "${indexFull}" ] ; then
      mv -f ${indexFull} ${index}
    fi
  fi
  cat ${index}|sed 's/<meta name="robots".*/<meta name="robots" content="noindex, nofollow">/' > ${staging_dir}/tmp.file
  mv -f ${staging_dir}/tmp.file ${index}
elif [ "${action}" == 'disable' ] ; then
  echo "Running disable staging script"
  if [ ! -f "${indexFull}" ] ; then
    mv -f ${index} ${indexFull}
  fi
  cat > ${index} <<EOL
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="robots" content="noindex, nofollow">
    </head>
    <body></body>
  </html>
EOL
fi
