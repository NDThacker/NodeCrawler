const bdp = require('body-parser');
const cors = require('cors');
const errorlogger = require('./utilities/errorlogger');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const router = require('./routes/route');


const app = express();

app.use(bdp.json());
app.use(bdp.urlencoded({ extended: true }));
app.use(cors())
app.use(helmet());
app.use(morgan('common'));
// console.debug("Entering Router");
app.use('/', router);
app.use(errorlogger);

app.listen(process.env.PORT || 1050, function () {
	console.log("Server up and running");
});


