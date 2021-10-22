import { createStore } from 'redux';

//STORE
const initialState = {
  logged: false,
  token: '',
  username: '',
  id: null,
  lang: 'en',
  notificationAmount: 0
};

function Reducer(state = initialState, action) {
// Reducers usually look at the type of action that happened
// to decide how to update the state
  switch (action.type) {
    case "logged/true":
      return { ...state, logged: true };

    case "logged/false":
      return { ...state, logged: false };

    case "tokenSet":
      return { ...state, token: action.payload };

    case "tokenReset":
      return { ...state, token: '' };

    case "usernameSet":
      return { ...state, username: action.payload };

    case "usernameReset":
      return { ...state, username: '' };

    case "idSet":
      return { ...state, id: action.payload };

    case "idReset":
      return { ...state, id: '' };

    case "langSet":
      return { ...state, lang: action.payload };

    case "langReset":
      return { ...state, lang: '' };

    case "notificationAmountSet":
      return { ...state, notificationAmount: action.payload };

    case "resetStore":
      return {...state, logged: false, token: '', username: '', id: null, lang: 'en', notificationAmount: 0};

    default:
      // If the reducer doesn't care about this action type,
      // return the existing state unchanged
      return state;
  }
}
const store = createStore(Reducer);

export default store;