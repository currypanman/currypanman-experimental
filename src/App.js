import logo from './logo.svg';
import './App.css';

function App() {
  const state = true;
  return (
    state ? (
      <div>
        <input accept='image/*' capture='environment' className='visually-hidden' type='file' />
      </div>
    ) : (
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
    )
  );
}

export default App;
