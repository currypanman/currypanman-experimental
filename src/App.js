import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { gsap } from 'gsap';
import { DbSample } from './DbSample';
import Phaser from 'phaser';

const State = {
  Demo: 1,
  Capture: 2,
  Gsap: 3,
  DbSample: 4,
  Phaser: 5,
}

function App() {
  const state = State.Phaser;
  const header = React.createRef();
  const bear = React.createRef();

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to('.kuma-header span', {x:-250 - window.innerWidth / 2, duration: 0.3, stagger: 0.3});
    tl.to(bear.current, {y:-267, duration: 1});
  }, [header, bear]);

  const [game, setGame] = useState();

  switch (state) {
    case State.Phaser:
      function preload() {
        this.load.setBaseURL('https://labs.phaser.io');

        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png');
      }

      function create() {
        this.add.image(400, 300, 'sky');

        const emitter = this.add.particles(0, 0, 'red', {
          speed: 100,
          scale: { start: 1, end: 0 },
          blendMode: 'ADD'
        });

        const logo = this.physics.add.image(400, 100, 'logo');

        logo.setInteractive({ draggable: true });
        logo.on('drag', (p, x, y) => logo.setPosition(x, y));
        logo.setCollideWorldBounds(true);

        emitter.startFollow(logo);
      }

      const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 }
          }
        },
        scene: {
          preload: preload,
          create: create
        }
      };

      if (!game) {
        setGame(new Phaser.Game(config));
      }

      return (
        <div></div>
      );
    case State.DbSample:
      return DbSample();
    case State.Gasp:
      return (
        <div className="kuma-container">
          <h1 className="kuma-header" ref={header}>
            <span>Present</span>
            <span>&nbsp;</span>
            <span>from</span>
            <span>&nbsp;</span>
            <span>Kuma!</span>
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
