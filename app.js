//dependency requires
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongo = require('mongoose'),
    cookieSession = require('cookie-session'),
    passport = require('passport'),
    url = require('url'),
    shipit = require('shipit');
//config requires
var keys = require('./config/keys'),
    auth = require('./config/auth');

//export modules to make them accessible by other server node files
module.exports = { io, url};

//database handler
mongo.Promise = global.Promise;
mongo.connect(keys.mongodb.dbURI, { useMongoClient: true }, function () {
    console.log("connected to database");
});

app.set('view engine', 'ejs');

//pass values to ejs directly
app.locals = ({
    site : {
        pageTitle: "Mail Management",
        siteTitle: "",
    }
});

//handle post with express 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//set up cookie
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//route requires
var routes = require('./routes'),
    authRoutes = require('./routes/auth-routes'),
    profileRoutes = require('./routes/profile-routes');
    trackingRoutes = require('./routes/tracking-routes');


//setup routes
app.use('/', routes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/tracking', trackingRoutes);
app.get('*', function(req,res) {
    res.render("404",{ addonTitle: "Page Not Found" });
});

/*  maybe go back to this if I decide to remove socket.io from the login 
app.listen(3000, function() {
    console.log("app running on localhost:3000...");
}); */

http.listen(8080, function () {
    console.log("running on port 8080..");
});