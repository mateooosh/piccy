import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"

import '../App.scss'
import LoginView from "../views/LoginView/LoginView"
import {useSelector, useStore} from "react-redux"
import RegisterView from "../views/RegisterView/RegisterView"
import HomeView from "../views/HomeView/HomeView"
import PostView from "../views/PostView/PostView"

export default function Navigation() {
  const store = useStore()
  const logged = useSelector(state => state.logged)

  return (
    <Router>
      {logged ? (
        <Switch>
          <Route path="/post/:id">
            <PostView/>
          </Route>
          <Route path="/">
            <HomeView/>
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