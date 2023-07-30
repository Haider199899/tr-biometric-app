const {Log} = require('../models/logging.model');
const createLog = (req, res, next) => {
    const requestStart = new Date().getTime();
    res.on("finish", function() {
        const log = new Log();
        log.timestamp = Date.now();
        log.processingTime = new Date().getTime() - requestStart
        log.url = decodeURI(req.url)
        log.statusCode = res.statusCode;
        log.statusMessage = res.statusMessage
        log.method = req.method;
        log.save()
    });
    next();
  };
  module.exports = createLog;