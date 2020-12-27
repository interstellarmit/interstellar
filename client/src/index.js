import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.js";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
// renders React Component "Root" into the DOM element with ID "root"
ReactDOM.render(
  <Router>
    <Switch>
      <App path="/:semester" />
      <Route
        default
        render={() => {
          return <Redirect to="/spring-2021" />;
        }}
      />
    </Switch>
  </Router>,

  document.getElementById("root")
);

// allows for live updating
module.hot.accept();
