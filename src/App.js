import React, { useState, useEffect } from 'react';
import { decode } from 'he';
import { withAuth } from '@okta/okta-react';

import logo from './chuck-norris.png';
import './App.css';
import { useAuth } from './auth';

const App = withAuth(({ auth }) => {
  const [joke, setJoke] = useState('');
  const [authenticated, user] = useAuth(auth);

  const fetchJoke = async signal => {
    const url = new URL('https://api.icndb.com/jokes/random');
    if (user) {
      url.searchParams.set('firstName', user.given_name);
      url.searchParams.set('lastName', user.family_name);
    }
    const response = await fetch(url, { signal });
    const { value } = await response.json();

    setJoke(decode(value.joke));
  };

  useEffect(() => {
    if (!joke) {
      const controller = new AbortController();
      fetchJoke(controller.signal);

      return () => controller.abort();
    }
  }, [joke]);

  useEffect(() => {
    setJoke('');
  }, [user]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{joke || '...'}</p>
        <button className="App-link" onClick={() => setJoke('')}>
          Get a new joke
        </button>
        {authenticated !== null && (
          <button
            onClick={() => authenticated ? auth.logout() : auth.login()}
            className="App-link"
          >
            Log {authenticated ? 'out' : 'in'}
          </button>
        )}
      </header>
    </div>
  );
});

export default App;
