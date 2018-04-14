var mongoose = require('mongoose');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-Parser');
var hbs = require('hbs');
var path = require('path');
var expressValidator = require('express-validator');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

mongoose.connect('mongodb://localhost/mongoose_basics', function (err) {

   if (err) throw err;

   console.log('Successfully connected');

});


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');
//app.set()
//Middleware Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Session-MongoDB Middleware
var store = new MongoDBStore(
      {
        uri: 'mongodb://localhost:27017/connect_mongodb_session_test',
        databaseName: 'connect_mongodb_session_test',
        collection: 'mySessions'
      });

    // Catch errors
    store.on('error', function(error) {
      assert.ifError(error);
      assert.ok(false);
    });
//Express session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  store: store,
  saveUninitialized: false,
  //cookie: { secure: true }
}))

//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});


//express validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Routes Middleware
app.use('/', routes);
app.use('/users', users);

app.set('port', (process.env.PORT || 3000));


app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
