import React, { useState, useEffect } from 'react';
import { decode } from 'he';

import logo from './chuck-norris.png';
import './App.css';

const App = () => {
  const [joke, setJoke] = useState('');

  const fetchJoke = async () => {
    const response = await fetch('https://api.icndb.com/jokes/random');
    const { value } = await response.json();

    setJoke(decode(value.joke));
  };

  useEffect(() => {
    if (!joke) {
      fetchJoke();
    }
  }, [joke]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{joke || '...'}</p>
        <button className="App-link" onClick={() => setJoke('')}>
          Get a new joke
        </button>
      </header>
    </div>
  );
}

export default App;
