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
    letterElements: [String],
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

// Temporary game used for testing
var gameTemp = {
  boardXSize: 5,
  boardYSize: 5,
  gameNumber: 0,
  boardElements: ['', '', '', '', '', 
                  '', '', '', '', '',
                  '', '', '', 'A', 'T',
                  'W', 'O', 'R', 'D', '',
                  '', '', 'E', 'E', ''],
  letterElements: ['H', 'E', 'S', 'A', 'T'],
};

app.get('/play/:gameNumber', function(req, res){
  var gameNumber = req.params.gameNumber;
  console.log("Game Number = " + gameNumber);

  //TODO need to check if user is authorized to play level
  /*
  Game.find({gameNumber: req.body.gameNumber}, function(error, response){
    if (error){
      console.log(error);
      res.status(500).send(error);
    }

    // TODO next
  });
  */

  res.render('play', { game: gameTemp });
});

module.exports = app;
