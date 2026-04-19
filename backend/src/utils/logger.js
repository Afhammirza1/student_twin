function log(message) {
  console.log(`[LOG]: ${message}`);
}

function errorLog(err) {
  console.error(`[ERROR]: ${err}`);
}

module.exports = { log, errorLog };
