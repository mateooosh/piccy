import {useSelector, useStore} from "react-redux";
import Navigation from "./Navigation/Navigation";

export default function App() {
  const store = useStore();
  const logged = useSelector(state => state.logged);

  function onClick() {
    if(logged) {
      store.dispatch({type: "logged/false"});
    }
    else {
      store.dispatch({type: "logged/true"});
    }

  }

  return (
    <div className="App">
      <h4 onClick={onClick}>
        {logged ? 'Logged' : 'Not logged'}
      </h4>
      <Navigation/>
    </div>
  );
}

