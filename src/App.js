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
  render() {
    var testBoard = [
      ['', '', '', '', ''],
      ['', 'a', 'b', 'c', ''],
      ['', 'a', 'b', 'c', ''],
    ];
    var testLetters = ['a', 'b', 'c'];
    return (
      <div className="Game">
        <GameBoard letters={testBoard}/>
        <LetterBoard letters={testLetters}/>
      </div>
    );
  }
}

class GameBoard extends Component {
  renderRow(letters) {
    return <BoardRow letters={letters} />
  }
  render() {
    var table = [];
    this.props.letters.forEach((letterRow) => {
      console.log(letterRow);
      table.push(this.renderRow(letterRow));
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
  renderLetter(letter) {
    return <Letter letter={letter} />
  }
  render() {
    var letters = [];
    this.props.letters.forEach((letter) => {
      letters.push(this.renderLetter(letter));
    });
    return (
      <div className="BoardRow">
        {letters}
      </div>
    );
  }
}

class LetterBoard extends Component {
  renderLetter(letter) {
    return <Letter letter={letter} />;
  }
  render() {
    var letters = [];
    this.props.letters.forEach((letter) => {
      letters.push(this.renderLetter(letter));
    });
    return (
      <div className="LetterBoard">
        {letters}
      </div>
    );
  }
}

class Letter extends Component {
  render() {
    return (
      <button className="Letter">
        {this.props.letter}
      </button>
    );
  }
}


export default App;
