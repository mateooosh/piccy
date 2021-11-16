import { createStore } from 'redux'

//STORE
const initialState = {
  logged: true,
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzksImlhdCI6MTYzMTQ2NjE5MSwiZXhwIjoxNjMxNTUyNTkxfQ.5wTXB5pPvS3cF2jasWIlft_Pb6rSf81cv2qgkNemS-A',
  username: 'rooman',
  id: 39,
  lang: 'en',
  notificationAmount: 0,
  avatar: null
}

function Reducer(state = initialState, action) {
// Reducers usually look at the type of action that happened
// to decide how to update the state
  switch (action.type) {
    case "logged/true":
      return { ...state, logged: true }

    case "logged/false":
      return { ...state, logged: false }

    case "tokenSet":
      return { ...state, token: action.payload }

    case "tokenReset":
      return { ...state, token: '' }

    case "usernameSet":
      return { ...state, username: action.payload }

    case "usernameReset":
      return { ...state, username: '' }

    case "idSet":
      return { ...state, id: action.payload }

    case "idReset":
      return { ...state, id: '' }

    case "langSet":
      return { ...state, lang: action.payload }

    case "langReset":
      return { ...state, lang: '' }

    case "avatarSet":
      return { ...state, avatar: action.payload }

    case "avatarReset":
      return { ...state, avatar: '' }

    case "notificationAmountSet":
      return { ...state, notificationAmount: action.payload }

    case "resetStore":
      return {...state, token: '', username: '', id: null, lang: 'en', notificationAmount: 0, logged: false}

    default:
      // If the reducer doesn't care about this action type,
      // return the existing state unchanged
      return state
  }
}
const store = createStore(Reducer)

export default store