// TODO
//
// POSSIBLE OPTIMIZATIONS
//    Draggable / Droppable for the letters
//        Would need separate classes for gameButtons and letterButtons
//    A trie for the word checking

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
        ['', '', '', '', ''],
        ['', 'a', 'b', 'c', ''],
        ['', 'a', 'b', 'c', ''],
      ],
      prevBoard:[
        ['', '', '', '', ''],
        ['', 'a', 'b', 'c', ''],
        ['', 'a', 'b', 'c', ''],
      ],
      letters: ['a', 'b', 'c'],
      prevLetters: ['a', 'b', 'c']
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
        var newBoard = prevState.board;
        newBoard[rowIdx][letterIdx] = prevState.letters[prevState.curLetter];
        prevState.letters.splice(prevState.curLetter, 1);
        return {
          board: newBoard,
          curLetter: -1,
          letters: prevState.letters
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
        var newBoard = [];
        prevState.board.forEach(function(row) {
          newBoard.push(row.slice());
        })
        return {
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
        if (horizWord.word.length > 1 && horizWord.isNew) console.log(horizWord.word);
        if (vertWord[col].word.length > 1 && vertWord[col].isNew) console.log(vertWord[col].word);
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
      if (horizWord.word.length > 1 && horizWord.isNew) console.log(horizWord.word);
      horizWord.word = '';
      horizWord.isNew = false;
    }
  }
  
  // Check for vertical edge cases
  for (var col = 0; col < numCols; col ++) {
    if (vertWord[col].word.length > 1 && vertWord[col].isNew) console.log(vertWord[col].word);
  }

  return true;
}

export default App;
