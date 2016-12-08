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
    return (
      <div className="Game">
        <GameBoard />
        <LetterBoard />
      </div>
    );
  }
}

class GameBoard extends Component {
  render() {
    return (
      <div className="GameBoard">
        <Letter letter="s" />
      </div>
    );
  }
}

class LetterBoard extends Component {
  render() {
    return (
      <div className="LetterBoard">
        <Letter letter="s" />
      </div>
    );
  }
}

class Letter extends Component {
  render() {
    return (
      <div className="Letter">
        {this.props.letter}
      </div>
    );
  }
}


export default App;
