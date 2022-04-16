const fs = require('fs');

function errorlogger(err, req, res, next) {
	console.debug("In error logger");
	fs.appendFile('../errorlogger.txt', "Error: " + err.message + "\n" +err.stack + "\n", err => {
		if(err) console.error("Error in Logging error " + err);
	})
	console.debug("Should have written in error log file");
	if(err.status) {
		res.status(err.status);
		// res.statusCode = err.status;
	}
	else {
		res.status = 500;
	}
	console.debug("Error: " + err.message + "\n" +err.stack + "\n");
	res.json({ "error" : err.message });
}

module.exports = errorlogger;