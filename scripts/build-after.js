var process = require('child_process');

module.exports = function(ctx) {
  console.log('Running after build script(build-after.js)');
  process.exec('bash ./scripts/build-after.sh',function (err,stdout,stderr) {
    if (err) {
      console.log("\n"+stderr);
    } else {
      console.log(stdout);
      console.log('Done. (build-after.js)')
    }
  });
};