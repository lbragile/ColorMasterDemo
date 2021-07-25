import React, { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Redirect, Switch } from "react-router-dom";

const RGB = lazy(() => import("./RGB"));
const HEX = lazy(() => import("./HEX"));
const HSL = lazy(() => import("./HSL"));

export default function App(): JSX.Element {
  return (
    <Router>
      <Suspense fallback={<div>Loading</div>}>
        <Switch>
          <Route path="/rgb" component={RGB} />
          <Route path="/hex" component={HEX} />
          <Route path="/hsl" component={HSL} />
          <Redirect from="*" to="/rgb" />
        </Switch>
      </Suspense>
    </Router>
  );
}
