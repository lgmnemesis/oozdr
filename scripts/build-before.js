var process = require('child_process');

module.exports = function(ctx) {
  console.log('Running before build script(build-before.js)');
  process.exec('bash ./scripts/build-before.sh',function (err,stdout,stderr) {
    if (err) {
      console.log("\n"+stderr);
    } else {
      console.log(stdout);
      console.log('Done. (build-before.js)')
    }
  });
};