const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const cors = require('cors');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const log4js = require('log4js');
const Constants = require('./config/constants');
const ErrorCodes = require('./config/errorCodes');

/**
 * Setup logger
 */
log4js.configure({
    appenders: { dev: { type: 'file', filename: path.join(__dirname, 'dev.log') } },
    categories: { default: { appenders: ['dev'], level: 'debug' } }
});



/**
 * Ensure log directory exists
 */
const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
//create a rotating write stream
const accessLogStream = rfs('access.log', {
    interval: '1d',
    path: logDirectory
})

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(Constants.MONGODB_URI);
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || Constants.PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(logger('combined', { stream: accessLogStream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: Constants.MONGO_SECRET,
    store: new MongoStore({
        url: Constants.MONGODB_URI,
        autoReconnect: true,
        clear_interval: 3600
    })
}));
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
//enabling CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.use(cors());


const apiRoutes = express.Router();

// route middleware to verify a token/auth
apiRoutes.use(function (req, res, next) {
    // not having any explicit token validation and  authentication
    next();
});

app.use('/api/v1', apiRoutes);
/**
 * View routes
 */
app.use('/', require('./routes/index'));

/**
 * Rest API Routes (route handlers).
 */
const user = require('./routes/api/user');
app.use('/api/v1/account', user);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
const host = 'localhost'; 
app.listen(app.get('port'), host, () => {
    console.log('%s App is running via http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log(' Test console\n');
    console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
