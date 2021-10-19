import logo from './logo.svg';
import {useSelector, useStore} from "react-redux";

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

  const a = 'sad';
  return (
    <div className="App" onClick={onClick}>
      {logged ? 'Logged' : 'Not logged'}
    </div>
  );
}

