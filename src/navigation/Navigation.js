import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import '../App.scss';
import LoginView from "../views/LoginView/LoginView";
import {useSelector, useStore} from "react-redux";
import RegisterView from "../views/RegisterView/RegisterView";

export default function Navigation() {
  const store = useStore()
  const logged = useSelector(state => state.logged)

  return (
    <Router>
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
            <RegisterView/>
          </Route>
          <Route path="/">
            <LoginView/>
          </Route>
        </Switch>
      )}
    </Router>
  )
}