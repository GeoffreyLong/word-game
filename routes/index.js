var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/wordGame', function (error) {
  if (error) {
      console.log(error);
  }
  else{
    console.log('Successfully Connected');
  }
});

//TODO Add creation schema (i.e. when person first plays game, need maps to load)
var Schema = mongoose.Schema;
var GameSchema = new Schema({
    boardXSize: Number,
    boardYSize: Number,
    gameNumber: String,
    // name: String,
    // The boardXSize and boardYSize will be used to delimit
    // Else the boardElements could be an array of arrays 
    // Elements should be empty string for empty block, and letters for blocks
    // This will be in sequence rowwise from top to bottom of screen
    // These go into games... i.e. wordGame is the db and games is the collection
    boardElements: [String],
    sidePanelElements: [String],
    // Can also include personal bests and moves to beat in here
});

//var Game = mongoose.model('games', GameSchema);
var Game = mongoose.model('test', GameSchema);

var express = require('express');
var app = express();

/* GET home page. */
app.get('/', function(req, res) {
  res.render('index', { title: 'Word Game', script: '/javascripts/index.js' });
});

// I think post is more secure for this
// In this way the user can't simply enter the url/newGame/3 to get to the third level
app.post('/newGame', function(req, res){
  console.log(req.body.gameNumber);
  Game.find({gameNumber: req.body.gameNumber}, function(error, response){
    if (error){
      console.log(error);
      res.status(500).send(error);
    }

    // TODO next
    //res.render('/play', { game: response, script: 'javascripts/play.js' });
  });
});

module.exports = app;
