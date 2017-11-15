import React, { Component } from 'react';
import './App.css';
import './iconfont/iconfont.css';
import {BrowserRouter as Router, Route} from "react-router-dom";

import GetCanvas from "./components/getCanvas/GetCanvas";
import ChooseScore from "./components/chooseScore/ChooseScore";
import Toggle from "./components/toggle/Toggle";


class App extends Component {
  render() {
    return (
        <Router>
          <div className="App">
              <Route exact path="/" component={GetCanvas}/>
              <Route path="/choosescore/:clothId" component={ChooseScore}/>
              <Route path="/toggle/:type/:clothId" component={Toggle}/>
          </div>
        </Router>
    );
  }
}

export default App;
