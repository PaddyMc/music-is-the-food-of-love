import React, { Component } from "react";
import Home from "../Home/Home";
// Uncomment this for hotswapping code
// import { hot } from "react-hot-loader";
import "./App.css";

class App extends Component{
  render(){
    return(
      <div className="App">
        <Home />
      </div>
    );
  }
}

export default App;