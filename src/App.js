// IMPORTANT TODO
//    Fix the header styling
//    Fix the game styling
//    Check the iterating with the /2... might not be an int
//        Consider Math.ceil
//    Checking for new words after collapsing
//        Multi-collapses are a good way to get extra points for stats
//
//
// TODO
//    Refactoring... Make my code more readable
//        If I replace the game div with something, then constructor is called again
//        Adding a menu screen might be a good option for this
//            In the menu, you would select the game you want to play
//            The back navigation button would be in the header I guess?
//    Add more games!
//    Stats and Unlocking new games
//        Might want to look into Redux before tackling this
//        I can do it with just react by using localStorage I think though
//        Redux might have some tools for global and persistent state though
//
// POSSIBLE OPTIMIZATIONS
//    Draggable / Droppable for the letters
//        Would need separate classes for gameButtons and letterButtons
//        Check out React DnD or similar
//    A trie for the word checking
//    Update WordList
//        A scrabble one would be great. 
//        This doesn't have "scat", so I'd imagine others are missing
//    Winning Stats
//        Would be cool to have the score be based on the complexity of letters used
//        Or on the complexity of words chosen
//        In addition to the current
//    PowerUps
//        Perhaps using certain words on certain boards will give "power ups"
//        Could also have powerUp tiles randomly
//        Example powerups
//            Explosion
//            Misc Character (wildcard)
//    Add a "how to"
//
// POSSIBLE NAMES
//    Negation

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import words from './wordlist.json';
import games from './gamelist.js';


class App extends Component {
  constructor() {
    super();

    this.state = {
      gameIdx: -1
    }
  }
  handleClick(i) {
    this.setState({
      gameIdx: i
    });
  }
  renderButtons(i) {
    return <button onClick={() => this.handleClick(i)}> {i} </button>
  }
  mainMenu() {
    this.setState({
      gameIdx: -1
    });
  }
  render() {
    var gameButtons = [];
    var that = this;
    games.forEach(function(game, gameIdx) {
      gameButtons.push(that.renderButtons(gameIdx));
    });

    return (
      <div className="App">
        <div className="Header">
          <button onClick={() => this.mainMenu()}> MENU </button>
          <div id="title"> {this.props.title} </div>
        </div>
        {this.state.gameIdx !== -1 && 
          <Game gameIdx={this.state.gameIdx} />
        }
        {this.state.gameIdx === -1 &&
          <div className="Menu">
            <div>
              <h1> Welcome To {this.props.title} </h1>
              <span> Please select a level </span>
            </div>
            <div className="GameButtons">
              {gameButtons}
            </div>
          </div>
        }
      </div>
    );
  }
}

// This should probably carry all of the state logic
class Game extends Component {
  constructor(props) {
    super(props);

    var game = games[this.props.gameIdx];
    var board = [];
    var prevBoard = [];
    game.board.forEach(function(row) {
      board.push(row.slice());
      prevBoard.push(row.slice());
    });
    this.state = {
      curLetter: -1,
      board: board,
      prevBoard: prevBoard,
      letters: game.letters.slice(),
      prevLetters: game.letters.slice(),
      numberOfMoves: 0
    };
  }
  handleLBClick(letterIdx) {
    this.setState((prevState) => ({
      curLetter: letterIdx
    }));
  }
  handleGBClick(letterIdx, rowIdx) {
    this.setState((prevState) => {
      if (prevState.board[rowIdx][letterIdx] == '' && prevState.curLetter != -1) {
        // Clone the board and add the letter
        var newBoard = [];
        prevState.board.forEach(function(row) {
          newBoard.push(row.slice());
        });
        newBoard[rowIdx][letterIdx] = prevState.letters[prevState.curLetter];

        // Clone and remove the used letter from letters
        var newLetters = prevState.letters.slice();
        newLetters.splice(prevState.curLetter, 1);

        return {
          board: newBoard,
          curLetter: -1,
          letters: newLetters
        };
      }
    });
  }
  resetBoard() {
    this.setState((prevState) => {
      var newBoard = [];
      prevState.prevBoard.forEach(function(row) {
        newBoard.push(row.slice());
      })
      return {
        board: newBoard,
        letters: prevState.prevLetters.slice(),
        curLetter: -1
      }
    });
  }
  handleSubmitClick() {
    if (isValid(this.state.board, this.state.prevBoard)) {
      this.setState((prevState) => {
        var newBoard = removeNew(prevState.board, prevState.prevBoard);
        condenseBoard(newBoard);
        var prevBoard = [];
        newBoard.forEach(function(row) {
          prevBoard.push(row.slice());
        });

        return {
          board: newBoard,
          prevBoard: newBoard,
          prevLetters: prevState.letters.slice(),
          numberOfMoves: prevState.numberOfMoves + 1
        }
      });
    }
    else {
      // Do the same as a click
      alert("Invalid");
      this.resetBoard();
    }
  }
  render() {
    var haveWon = checkWinningStatus(this.state.board);
    if (haveWon) {
      alert("You Won!");
      calcWinStats(this.state.numberOfMoves, this.state.prevLetters);
      // TODO update stats
      //      Winning animations?
      //      return to main menu
    }
    // Use previous letters since that is after a submission
    else if (!haveWon && this.state.prevLetters.length == 0) {
      alert("You Lost :(");
      // TODO update stats
      //      Losing animations?
      //      return to main menu
    }


    return (
      <div className="Game">
        <GameBoard  letters={this.state.board}
                    handleGBClick={(letter, row) => this.handleGBClick(letter, row)}/>
        <LetterBoard  letters={this.state.letters} 
                      curLetter={this.state.curLetter}
                      handleLBClick={(letterIdx) => this.handleLBClick(letterIdx)}
                      handleUndoClick={() => this.resetBoard()}
                      handleSubmitClick={() => this.handleSubmitClick()}/>
      </div>
    );
  }
}


// Right now it just takes the number of moves and letters
function calcWinStats(numberOfMoves, letters) {
  console.log(numberOfMoves);
  console.log(letters);

  // This is a rudimentary way of doing this
  console.log(letters.length / numberOfMoves);
}

function checkWinningStatus(board) {
  var numRows = board.length;
  var numCols = board[0].length;

  // Iterate over all the squares on the board
  // If there are any letters left then we have not won
  for (var row = 0; row < numRows; row ++) {
    for (var col = 0; col < numCols; col ++) {
      if (board[row][col] !== '') return false;
    }
  }

  return true;
}

class GameBoard extends Component {
  renderRow(letters, row) {
    return <BoardRow letters={letters} handleGBClick={(letter) => this.props.handleGBClick(letter, row)} />
  }
  render() {
    var table = [];
    this.props.letters.forEach((letterRow, row) => {
      table.push(this.renderRow(letterRow, row));
    });
    return (
      <div className="GameBoard">
        {table}
      </div>
    );
  }
}

class BoardRow extends Component {
  renderLetter(letter, letterIdx) {
    return <Letter letter={letter} handleClick={() => this.props.handleGBClick(letterIdx)}  />;
  }
  render() {
    var letters = [];
    this.props.letters.forEach((letter, letterIdx) => {
      letters.push(this.renderLetter(letter, letterIdx));
    });
    return (
      <div className="BoardRow">
        {letters}
      </div>
    );
  }
}

class LetterBoard extends Component {
  renderLetter(letter, letterIdx) {
    return <Letter letter={letter} handleClick={() => this.props.handleLBClick(letterIdx)}  />;
  }
  render() {
    var letters = [];
    this.props.letters.forEach((letter, letterIdx) => {
      letters.push(this.renderLetter(letter, letterIdx));
    });
    return (
      <div className="LetterBoard">
        <h3> Letter Selected: {(this.props.curLetter != -1 ? this.props.letters[this.props.curLetter] : '')} </h3>
        <div>
          {letters}
        </div>
        <GameButtons  handleUndoClick={() => this.props.handleUndoClick()}
                      handleSubmitClick={() => this.props.handleSubmitClick()}/>
      </div>
    );
  }
}

class Letter extends Component {
  render() {
    return (
      <button className="Letter" onClick={() => this.props.handleClick()}>
        {this.props.letter}
      </button>
    );
  }
}

class GameButtons extends Component {
  render() {
    return (
      <div className="GameButtons">
        <button onClick={() => this.props.handleUndoClick()}> Undo </button>
        <button onClick={() => this.props.handleSubmitClick()}> Submit </button>
      </div>
    );
  }
}

// This function will check whether or not the current board configuration is valid
// Note that I am not stopping people from putting words in empty space
//    If they want to waste letters, then they can
function isValid(board, prevBoard) {
  var numRows = board.length;
  var numCols = board[0].length;

  // These variables check for valid letter placement
  var newRow = -1;
  var newCol = -1;
  var hasNewWord = false;

  // These variables hold the created words
  var horizWord = {
    word: '',
    isNew: false
  };
  var vertWord = [];
  for (var i = 0; i < numCols; i ++) {
    vertWord.push({
      word: '',
      isNew: false
    });
  }

  // Iterate over all the squares on the board
  for (var row = 0; row < numRows; row ++) {
    for (var col = 0; col < numCols; col ++) {
      // This checks for added (new) letters
      if (board[row][col] != prevBoard[row][col]) {
        // The two next if statements check if the letter addition is valid
        // We cannot have two separate words entered in the same play
        if ((hasNewWord && horizWord.word === '' && vertWord[col].word === '')
              || (newRow !== -1 && newCol !== -1 && row !== newRow && col !== newCol)) { 
          console.log("Two Separates");
          return false;
        }
        if (newRow === -1 && newCol === -1) {
          newRow = row;
          newCol = col;
        }
        hasNewWord = true;


        // This will mark the word as containing a new addition 
        // so we know which words to check
        horizWord.isNew = true;
        vertWord[col].isNew = true;
      }

      // If the letter is '' then this indicates the end of a word
      // so reset both horizWord and vertWord 
      // and check the added words that are not just single letters
      if (board[row][col] === '') {
        if (horizWord.word.length > 1 && horizWord.isNew) {
          if (!isValidWord(horizWord.word)) return false;
        }  
        if (vertWord[col].word.length > 1 && vertWord[col].isNew) {
          if (!isValidWord(vertWord[col].word)) return false;
        }

        // Reset the corresponding words
        horizWord.word = '';
        horizWord.isNew = false;
        vertWord[col].word = '';
        vertWord[col].isNew = false;
      }
      // This will add the letter to the appropriate word
      else {
        horizWord.word += board[row][col];
        vertWord[col].word += board[row][col];
      }
    }

    // Checks for horizontal edge cases
    if (horizWord.word !== '') {
      if (horizWord.word.length > 1 && horizWord.isNew) {
        if (!isValidWord(horizWord.word)) return false;
      }
      horizWord.word = '';
      horizWord.isNew = false;
    }
  }
  
  // Check for vertical edge cases
  for (var col = 0; col < numCols; col ++) {
    if (vertWord[col].word.length > 1 && vertWord[col].isNew) {
      if (!isValidWord(vertWord[col].word)) return false;
    }
  }

  return true;
}

// Checks if the word is valid or not based on the wordlist.json provided
// TODO
//    This could probably be faster with a trie, I'm employing the most basic search.
//    It could even be better with some sort of alphabetical binary search
function isValidWord(word) {
  console.log(word);
  if (words.wordlist.indexOf(word) >= 0) return true;
  return false;
}

// Recycles a lot of logic from the isValid function
// Also recycles a lot of logic internally
function removeNew(board, prevBoard) {
  var numRows = board.length;
  var numCols = board[0].length;
  var newBoard = Array(numRows).fill().map(() => Array(numCols).fill(null));

  // Iterate over all the squares on the board
  // Figure out which indices need to be removed
  for (var row = 0; row < numRows; row ++) {
    for (var col = 0; col < numCols; col ++) {
      // Counters for the loop
      var tempRow = row;
      var tempCol = col;

      if (newBoard[row][col] !== '') newBoard[row][col] = prevBoard[row][col];

      // If there is a new variable in a location
      // Then check outwards in each direction deleting any characters from the newWord
      if (board[row][col] != prevBoard[row][col]) {
        var distance = 1;
        while ((tempRow - distance >= 0) && board[tempRow - distance][tempCol]) {
          newBoard[tempRow - distance][tempCol] = '';
          distance += 1;
        }
        
        distance = 1;
        while ((tempRow + distance < numRows) && board[tempRow + distance][tempCol]) {
          newBoard[tempRow + distance][tempCol] = '';
          distance += 1;
        }
        
        distance = 1;
        while (board[tempRow][tempCol + distance]) {
          newBoard[tempRow][tempCol + distance] = '';
          distance += 1;
        }

        distance = 1;
        while (board[tempRow][tempCol - distance]) {
          newBoard[tempRow][tempCol - distance] = '';
          distance += 1;
        }
      }
    }
  }

  return newBoard;
}

function condenseBoard(board) {
  // Condense the vertical before the horizontal
  // Both functions find stranded elements and move them to be on the "word tree"

  // The elements are shifted as a block, down or over one space
  // This single shift might be inefficient since the graph needs to be crawled each time
  // TODO improve?

  // Both functions return true as long as elements are moved
  while (condenseVertical(board));
  while (condenseHorizontal(board));

  console.log("done");
}

function createVisitedBoard(board) {
  var numRows = board.length;
  var numCols = board[0].length;

  // This tempBoard will have an isGrounded flag which means it was visited
  var newBoard = [];
  for (var row = 0; row < numRows; row ++) {
    var tempRow = [];
    for (var col = 0; col < numCols; col ++) {
      tempRow.push({
        val: board[row][col],
        visited: false
      });
    }
    newBoard.push(tempRow);
  }

  return newBoard;
}

function checkConnected(board, row, col) {
  var numRows = board.length;
  var numCols = board[0].length;

  if (board[row][col].visited) return;
  if (board[row][col].val) {
    board[row][col].visited = true;
    if (row+1 < numRows) checkConnected(board, row+1, col);
    if (row-1 >= 0) checkConnected(board, row-1, col);
    if (col+1 < numCols) checkConnected(board, row, col+1);
    if (col-1 >= 0) checkConnected(board, row, col-1);
  }
}

// Checks to see if the elements are grounded
// Then will shift down any non-grounded elements
function condenseVertical(board) {
  var numRows = board.length;
  var numCols = board[0].length;
  var movedElms = false;
  var groundBoard = createVisitedBoard(board);

  var bottomRow = numRows - 1;
  for (var col = 0; col < numCols; col ++) {
    if (board[bottomRow][col] !== '') {
      checkConnected(groundBoard, bottomRow, col);
    }
  }

  for (var row = bottomRow; row >= 0; row --) {
    for (var col = 0; col < numCols; col ++) {
      if (groundBoard[row][col].val !== '' && !groundBoard[row][col].visited) {
        board[row+1][col] = board[row][col];
        board[row][col] = '';
        movedElms = true;
      }
    }
  }

  return movedElms;
}

function condenseHorizontal(board) {
  var numRows = board.length;
  var numCols = board[0].length;
  var movedElms = false;
  var direction = 0;

  var newBoard = createVisitedBoard(board);

  // Go bottom up from the outside in
  for (var col = 0; col < numCols/2 + 1; col ++) {
    for (var row = numRows-1; row >= 0; row --) {
      if ((numCols/2 + col < numCols) && board[row][numCols/2 + col] !== '') {
        checkConnected(newBoard, row, numCols/2 + col);
        direction = 1;
        break;
      }
      if ((numCols/2 - col - 1 >= 0) && board[row][numCols/2 - col - 1] !== '') {
        checkConnected(newBoard, row, numCols/2 - col - 1);
        direction = -1;
        break;
      }
    }
    if (direction != 0) break;
    if (numCols/2 + col >= numCols && numCols/2 - col - 1 < 0) break;
  }

  for (var row = numRows-1; row >= 0; row --) {
    for (var col = 0; col < numCols; col ++) {
      if (newBoard[row][col].val !== '' && !newBoard[row][col].visited) {
        board[row][col+direction] = board[row][col];
        board[row][col] = '';
        movedElms = true;
      }
    }
  }

  return movedElms;
}

export default App;
