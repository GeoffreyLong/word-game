// TODO
//
// POSSIBLE OPTIMIZATIONS
//    Draggable / Droppable for the letters
//        Would need separate classes for gameButtons and letterButtons
//    A trie for the word checking
//    Update WordList
//        A scrabble one would be great. 
//        This doesn't have "scat", so I'd imagine others are missing

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import words from './wordlist.json';


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="Header">
          header will be here
          will contain the levels... I guess
          maybe some concept of score
        </div>
        <Game />
      </div>
    );
  }
}

// This should probably carry all of the state logic
class Game extends Component {
  constructor() {
    super();

    this.state = {
      curLetter: -1,
      board: [
        ['', '', 'r', '', ''],
        ['', '', 'a', '', ''],
        ['', 'c', 'a', 'r', ''],
        ['', '', 't', '', ''],
        ['', '', 'e', '', ''],
      ],
      prevBoard:[
        ['', '', 'r', '', ''],
        ['', '', 'a', '', ''],
        ['', 'c', 'a', 'r', ''],
        ['', '', 't', '', ''],
        ['', '', 'e', '', ''],
      ],
      letters: ['s', 'c', 'e', 'a', 't'],
      prevLetters: ['s', 'c', 'e', 'a', 't']
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
          prevLetters: prevState.letters.slice()
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
        {letters}
        <div> Letter Selected: {(this.props.curLetter != -1 ? this.props.letters[this.props.curLetter] : '')} </div>
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
  // The iterators
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
  condenseVertical(board);
  condenseHorizontal(board);

}

function condenseVertical(board) {

  var numRows = board.length;
  var numCols = board[0].length;

  // Iterate over all the squares on the board
  for (var row = 0; row < numRows; row ++) {
    for (var col = 0; col < numCols; col ++) {
      var tempRow = row;
      var tempCol = col;
      // Undefined will map to false?
      // Need the extra logic for the rows, 
      // since indexing on an undefined will throw an err
      while (board[tempRow][tempCol] !== '' && 
              !(((tempRow + 1 < numRows) && board[tempRow+1][tempCol])
                  || ((tempRow - 1 >= 0) && board[tempRow-1][tempCol])
                  || board[tempRow][tempCol+1] || board[tempRow][tempCol-1])) {
        // Shift the element down as far as possible
        if (tempRow + 1 < numRows) {
          board[tempRow+1][tempCol] = board[tempRow][tempCol];
          board[tempRow][tempCol] = '';
          tempRow += 1;
        }
        else {
          break;
        }
      }
    }
  }
}

function condenseHorizontal(board) {
  var numRows = board.length;
  var numCols = board[0].length;

  // Iterate over all the squares on the board
  for (var row = 0; row < numRows; row ++) {
    for (var col = 0; col < numCols; col ++) {
      var tempRow = row;
      var tempCol = col;
      // Undefined will map to false?
      // Need the extra logic for the rows, 
      // since indexing on an undefined will throw an err
      while (board[tempRow][tempCol] !== '' && 
              !(((tempRow + 1 < numRows) && board[tempRow+1][tempCol])
                  || ((tempRow - 1 >= 0) && board[tempRow-1][tempCol])
                  || board[tempRow][tempCol+1] || board[tempRow][tempCol-1])) {
        // Shift the element to the left or right towards the closest element
        // Defaults to a right shift
        // This means increment the column (right shift)
        // -1 is for decrementing
        var rightShiftCount = 1;
        var leftShiftCount = -1;

        // Increase looking for elements to the left and right
        // Break when an elm is found to the left or right, 
        //    or when both indices are out of range
        while ((tempCol + leftShiftCount >= 0 || tempCol + rightShiftCount < numCols)
                && !board[tempRow][tempCol + rightShiftCount] 
                && !board[tempRow][tempCol + leftShiftCount]) {
          rightShiftCount += 1;
          leftShiftCount -= 1;
        }

        // Default to the right element if both are equal
        // If the left element is closer then go there
        // If neither crawler found an element, then just leave the current where it is
        if (board[tempRow][tempCol + rightShiftCount] !== '') {
          board[tempRow][tempCol + rightShiftCount - 1] = board[tempRow][tempCol];
          board[tempRow][tempCol] = '';
          tempCol += rightShiftCount - 1;
        }
        else if (board[tempRow][tempCol + leftShiftCount] !== '') {
          board[tempRow][tempCol + leftShiftCount + 1] = board[tempRow][tempCol];
          board[tempRow][tempCol] = '';
        }

        tempCol += 1;
      }
    }
  }
}

export default App;
