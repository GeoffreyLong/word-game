// TODO
//
// POSSIBLE OPTIMIZATIONS
//    Draggable / Droppable for the letters
//        Would need separate classes for gameButtons and letterButtons
//    A trie for the word checking

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


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
      board: [
        ['', '', '', '', ''],
        ['', 'a', 'b', 'c', ''],
        ['', 'a', 'b', 'c', ''],
      ],
      letters: ['a', 'b', 'c']
    };
  }
  handleLBClick(letterIdx) {
    alert("ok: " + letterIdx);
  }
  handleGBClick(letter, row) {
    alert("ok2: " + letter + " " + row);
  }
  handleUndoClick() {
    alert("undo");
  }
  handleSubmitClick() {
    alert("submit");
  }
  render() {
    return (
      <div className="Game">
        <GameBoard  letters={this.state.board}
                    handleGBClick={(letter, row) => this.handleGBClick(letter, row)}/>
        <LetterBoard  letters={this.state.letters} 
                      handleLBClick={(letterIdx) => this.handleLBClick(letterIdx)}
                      handleUndoClick={() => this.handleUndoClick()}
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
      console.log(letterRow);
      table.push(this.renderRow(letterRow, row));
    });
    console.log(table);
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
        <div> Letter Selected: TODO </div>
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


export default App;
