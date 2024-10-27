// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Switch } from "react-router-dom";
import Login from "./components/login";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        {/* Adicione outras rotas conforme necessário */}
      </Switch>
    </Router>
  );
}

export default App;
