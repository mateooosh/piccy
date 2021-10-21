import {useSelector, useStore} from "react-redux";
import Navigation from "./navigation/Navigation";
import {createTheme, StyledEngineProvider, ThemeProvider} from '@mui/material/styles';

import variables from './styles/variables.module.scss';
console.log(variables)

export default function App() {
  const store = useStore();
  const logged = useSelector(state => state.logged);

  function onClick() {
    if (logged) {
      store.dispatch({type: "logged/false"});
    } else {
      store.dispatch({type: "logged/true"});
    }
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: variables.primary,
        light: "#ff0",
        dark: variables.primaryHover
      }
    }
  });

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          <h4 onClick={onClick}>
            {logged ? 'Logged' : 'Not logged'}
          </h4>
          <Navigation/>
        </StyledEngineProvider>
      </ThemeProvider>

    </div>
  );
}

