import {useSelector, useStore} from "react-redux";
import Navigation from "./navigation/Navigation";
import {createTheme, StyledEngineProvider, ThemeProvider} from '@mui/material/styles';

import variables from './styles/variables.module.scss';
console.log(variables)

// require('dotenv').config()

console.log(process.env.REACT_APP_API_URL)

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
        main: variables['primary-main'],
        light: variables['primary-light'],
        dark: variables['primary-dark']
      }
    }
  });

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          <Navigation/>
        </StyledEngineProvider>
      </ThemeProvider>
    </div>
  );
}

