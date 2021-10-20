import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Button from "../components/button/Button";

export default function Navigation() {
  return(
    <Router>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="register">Register</Link>
      </div>
      <Switch>
        <Route path="/register">
          <div>
            <Button type="outline" content="Button"/>
          </div>
        </Route>
        <Route path="/">
          <div>Home</div>
        </Route>
      </Switch>
    </Router>
  )
}