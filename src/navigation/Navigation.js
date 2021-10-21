import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import '../App.scss';
import LoginView from "../views/LoginView";

export default function Navigation() {
  return (
    <Router>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="register">Register</Link>
      </div>
      <Switch>
        <Route path="/register">
          register
        </Route>
        <Route path="/">
          <LoginView/>
        </Route>
      </Switch>
    </Router>
  )
}