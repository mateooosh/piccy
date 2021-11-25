import {useSelector, useStore} from "react-redux";
import Navigation from "./navigation/Navigation";
import {createTheme, StyledEngineProvider, ThemeProvider} from '@mui/material/styles';

import variables from './styles/variables.module.scss';
import {SnackbarProvider} from "notistack";
import {useEffect} from "react";


export default function App() {
  const store = useStore();
  const logged = useSelector(state => state.logged);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token) {
      console.log(token)
      store.dispatch({type: "tokenSet", payload: token})
      store.dispatch({type: "usernameSet", payload: localStorage.getItem('username')})
      store.dispatch({type: "idSet", payload: localStorage.getItem('id')})
      store.dispatch({type: "avatarSet", payload: localStorage.getItem('avatar')})
      store.dispatch({type: "roleSet", payload: localStorage.getItem('role')})
      store.dispatch({type: "logged/true"})
    }
  }, [])

  const theme = createTheme({
    palette: {
      primary: {
        main: variables['primary-main'],
        light: variables['primary-light'],
        dark: variables['primary-dark']
      }
    }
  })

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          <SnackbarProvider maxSnack={3}>
            <Navigation />
          </SnackbarProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    </div>
  )
}

