import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { gsap } from 'gsap';

const State = {
  Demo: 1,
  Capture: 2,
  Gsap: 3,
}

function App() {
  const state = State.Gasp;
  const header = React.createRef();
  const bear = React.createRef();

  useEffect(() => {
    gsap.to(header.current, {x:-250 - window.innerWidth / 2, duration: 1, onComplete: () => {
      gsap.to(bear.current, {y:-267, duration: 1});
    }});
  }, [header, bear]);

  switch (state) {
    case State.Gasp:
      return (
        <div className="kuma-container">
          <h1 className="kuma-header" ref={header}>
            Present from Kuma!
          </h1>
          <img className="kuma-bear" ref={bear}
            src={`${process.env.PUBLIC_URL}/present_kuma.png`} />
        </div>
      );
    case State.Capture:
      return (
        <div>
          <input accept='image/*' capture='environment' className='visually-hidden' type='file' />
        </div>
      );
    case State.Demo:
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      );
  }
}

export default App;
