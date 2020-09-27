import React, { lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

const Player = lazy(() => import("./views/player"));
const GameScreen = lazy(() => import("./views/gamescreen"));

function App() {
  return (
    <Suspense fallback={<div>loading</div>}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/play" component={Player} />
          <Route exact path="/" component={GameScreen} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
