import React, { Fragment, useEffect, useState, useContext } from 'react'
import logo from './logo.svg';
import './App.css';
import { Provider } from './context.js';
import { RoutesMain } from './components/RoutesMain';
import './components/main.css';


function App() {
  return (
    <div className="App">
      <Provider>
        <RoutesMain />
      </Provider>
    </div>
  );
}

export default App;
