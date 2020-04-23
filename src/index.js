import React from 'react';
import ReactDOM from 'react-dom';

import Toolbar from './components/Toolbar';
import Graph from './components/Graph';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/variants.css';
import './index.css';

const App = () => {

  return (
    <div className="content">
      <Toolbar />
      <div id="cy-wrapper">
        <Graph />
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'))