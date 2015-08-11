///////////
// SET UP
///////////
var express = require('express');
var app = express();
var mongoose = require('mongoose');

var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)


///////////
// CONFIG
///////////
mongoose.connect('mongodb://localhost/apollo');                 // UPDATE when we change the db name in deployment
app.use(express.static(__dirname + '/../client/'));             // set the static files location /client/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


///////////
// MODELS
///////////
var User = require('./users/userModel.js');
var Game = require('./games/gameModel.js');
var ChallengeBatch = require('./challengeBatches/challengeBatchModel.js');
var security = require('./security/sessionAuthorization.js'); // ** ADDED **


///////////
// ROUTES
///////////
// SIGNUP
app.post('/api/users', function (req, res){
  var user = new User();
  user.email = req.body.email;
  user.password = req.body.password;
  user.initials = req.body.initials;
  user.highscore = 0;

  // IF SENT USER DATA FAILS ANY VALIDATIONS, SEND ERROR
  // OTHERWISE, SEND BACK NEW USER
  user.save(function(err) {
    if (err) {
      console.log('ERROR:', err);
      res.send(err);
    }
    res.json(user);
  });
});

// HIGH SCORES
app.get('/api/minHighscore', function (req, res){
  //look through data base and retrieve lowest highscore
  Game.find({})
    .sort('-highscore')
    .exec(function (err, games) {
      if (err) {
        console.log('ERROR',err);
        res.send(err);
      }

      // sends back 10th highscore
      // arbitrary # of how many you want in Leaderboard (maybe extract to variable)
      res.json(games[9].highscore);
  });
});

// GAMES
app.post('/api/games', security.checkSession /* added */, function (req, res){
  var game = new Game();
  game.initials = req.body.initials;
  game.highscore = req.body.highscore;
  game.date = new Date();

  game.save(function(err){
    if (err) {
      console.log('ERROR:', err);
      res.send(err);
    }

    res.json(game);
  });
});

// LEADERBOARD
app.get('/api/leaderboard', function (req, res){
  Game.find({})
    .sort('-highscore')
    .limit(10)
    .exec(function (err, games){
      if(err){
        console.log('ERROR:', err);
        res.send(err);
      }

      res.json(games);
    });
});

// CHALLENGE BATCH
app.get('/api/challengeBatch/:id', function (req, res){
  var batch = req.body.batch;

  ChallengeBatch.find({id: req.params.id})
    .exec(function(err, batch){
      if (err) {
        console.log('ERROR:', err);
        res.end(err);
      }

      res.json(batch);
  });
});


// Session Model - ADDED
var Session = require('./security/sessionModel.js');

// SESSIONS - ADDED
app.post('/api/sessions', function (req, res){
  var session = new Session();
  session.date = new Date();

  session.save(function(err){
    if (err) {
      console.log('ERROR:', err);
      res.send(err);
    }

    res.json( {session: session._id} );
  });
});


///////////
// LISTEN
///////////
app.listen(8080); //change this for production
console.log("App listening on port 8080");
