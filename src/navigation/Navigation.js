import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import '../App.scss';
import LoginView from "../views/LoginView";
import {useSelector, useStore} from "react-redux";

export default function Navigation() {
  const store = useStore()
  const logged = useSelector(state => state.logged)

  return (
    <Router>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="register">Register</Link>
      </div>
      {logged ? (
        <Switch>
          <Route path="/">
            <div onClick={() => store.dispatch({type: 'resetStore'})}>
              Log out
            </div>
          </Route>
        </Switch>
      ) : (
        <Switch>
          <Route path="/register">
            register
          </Route>
          <Route path="/">
            <LoginView/>
          </Route>
        </Switch>
      )}
    </Router>
  )
}