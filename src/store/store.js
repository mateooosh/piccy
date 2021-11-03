import { createStore } from 'redux';

//STORE
const initialState = {
  logged: true,
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzksImlhdCI6MTYzMTQ2NjE5MSwiZXhwIjoxNjMxNTUyNTkxfQ.5wTXB5pPvS3cF2jasWIlft_Pb6rSf81cv2qgkNemS-A',
  username: 'asdasd',
  id: 40,
  lang: 'en',
  notificationAmount: 0,
  avatar: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAPo0lEQVR4AV3B24+l2VnY4d+71voO+1hVe1d1VXX1eWY8J3vGHExsKzhCjoJCCEEIJJC4Q8plIiQuo2Ck5A9ASHAbRVyhSOECEjtSkJCGC0NMHI/deLrd7unu6qruOu3zd17vG8qJFSnPI3/wL3/dytix6FpOXp/zw7bHz//6vyab3MVhXDMMEzADHxUzRTAigknERcPqFfMXD1nNT9g6fEC+dQsLGXG94OTRRxzsH5B6x2K9Yj2v2Rrm9JOUwXhI17SkPmB5hjNF6pKynKO+JZzM15AkRC9EE04/PeYv/+sf89Vf+1e4dISZAYJoxFRRBHBggBlOI/X5IxaffIOHf/st0tCx3BrRn9wj2zmgNzwkuAajw/mEpm148vwJH9y6Q88P2NneJapw7kY8nQW2mkveGsCg67FolDDwnqsYKesGbyn70xs8/NY3+cx7f8WDD/8xpjVWLtFyQbO6QLwQB4dko30cjs2nf037/C8oT19wOAngEsq6pL56St+uaGaPmV2VrM+fsXf0GepGcU4Y7+1DA4lP6eqCdbGgWZRYOcP2t0hCynbiCYOtIa8Xa+aXG4727vCdiyeUq4L/9B/+gF/8Jz/gqLegmp9ibUueOHzaZybb2MHnGPWH8OlfMrt8TWuCCxlJSCjqisW8o+42jHa2aZqSzcVLLpdrXLJNV0V0UVLjePrwBzx88ZiVNFTrDZe9lN7oLXbaDqdGOOuE45evmeZ7XKwLXhw/p4vG29MxD9wLtCrw/UiW5gxHOU3VMZSWJ8f/gyrxZFazagxVT+4jm9WGxbzALJLkKWcXc1QcWRjQmqPczJluT/nei4dY3ZJmGa+Lc3Zv3eT2O5+hWCw5Pn7C7o0JahXhk48/Ydfn7D94i//45/+ZsijpZykfvneL1gmLRcWr8xXaRqa7I0bjIUnaYmUL0TPrjEBKTkGMAubp9YZsNiXD4ZTQH7CqCtbLkhivWBUt2hmDwZiDW4do1fL21j1Gkx1m8xkUV5SzM+RghMWK8N7ogP79d/j6Jx+zXC4xM3qpMEh6NNJDsox8tKJtG5LhlHw8pYsVMZ6gPqMrC8aJ4/69d2mbjlVpvF7M2ZpEhuMxr8/OqLqG4Hvc2x/wM5Nd2i5lmA/JREm3h2hsia7i9n4foY+7e4DWa1pbEW787Ff53vELvvvxdzAzQkgYDQOL8xPybIwfTEjzEfk4oYvKq9PnFKsLqjqS5322Esd4OOXuG++TpQPUhL/65kckSUJdlQwSo+mMpq3xUcl1gc+2OVucc/PGHXyaYnWFdx3BB65JEFoShED46Lvf5uv/7c9wgIjDe09sHXW1Zmc8JsaWnhcGWULbNYQwJpYbLuZXzBZzPrh/l93dI7QDModax9tvvYtpS9t2CIqUNa+uVpyvWw73E4IHcTXff/TX7KQDpntHdJ3RxoJOlVahiZG2mxD++198A4cgAt47Br0+H7xzxO0bPfr9ffADtrdGVKosZhuGvUA6GJD0z+jaGuczenmfPO9hZgQTplvblE3FerVisrPH+fw55WpBcDnPX77mxt5trFU6jfz53z6m6ieE8TuoCSAIgmKogjNTvPeYGYbx5p0JP/25A4bZiH5vSN0oXV1AWzHIUybbW2RpSlvXaNcBQtO2zK8u2SwuqJuC1+evOH51QdW2DAYDxuMxdVnQLle0dc2nzz6la2umW2NuHYwpl2c0QHSBznlq52gRIuAQjzgBhF6eszNOiTFh0cD2MPD2g5tkriXpIjdvbJF5IzY1vTwl9YHeoM/p5RXfO10zKzrE93DJgKLz+BCYTCZkacqb926z3c9oqoTh4IjnryqWm5KdXBgmS6rFSyKGAqYONYgowVSICOI8aRKoioIfPH7EbBm5O92miY512SGuz9nZBTtbfVblhscvXvCZe3fp9XtMJ0NwGV1XE+uS6bDHwWSKWcOmWOPakp5TXJZwdPQu69UaLUqWFvGhZZzBqp0jegtwmCqCgRlO+L/EEUS4fXQXlwxx2YC/e/YM7wObeUO3bsh7AxqFi1VJmuU0dUVTlgzTlN3RgKTZ4Oo1xeUZmVMS54hth8WGzWYDyQ3MeQajEdvbE7JsTK83ZpB6aFZY1yGmiCmoIgbB+H96eU5wkdH+bbpkzePnT9m7uebojUOSbMBsvWBdKzs7E9rQ5+XZC24t59yc7tOWa6yNNKp4cVRFgQShrjYsF1c8ePeLXK0bsmGO6wokCfiuJQl9jIgPKRZbogQwwyxiZgREwAwRoW1blrMzjI6bt+7zU//gZxls3+Dk+39DrwWfjxikClnOG194k4++/ic8Pznlzt4RvTRldVVgyxobZJDl1HScr+bkQZj0A3cO94h1zauTBdaUrFbnHI4PONjNebbqMOsAAeHvObBIwDmIBhhp6vnsF77Iz//Cr3K5aXny5IRnp6+Z3HyAbRaEpEdve5ejG0fMNwv2927w9gdfZrm5ZLW+Is0C4/0hMfVcVmuK2NLElmx3j401bJnStg1lWfD6/Ix+1tJ2xuViQ7HuyIbGNRNDDMyEgCr/h3F4c8JPf+mr+MGUHz76mN/9d/+ekAR+53d+m8n+PUbjHSRJmc0veTl7zf7nP4ccbJHPNlS1UfsUU0NpsTxjJx9T5Ck3P3iXkzrww8dPGcaWlxczajFyB8uq5tHJhrDzWVw6ImrEzMAUTAkCGIb3jn/xK7/C9PAuy1XNG/ff5N987fc4fvEc7zK2tqeAkLgVut2yM71DK47ZouBmmhIlsD2ZErtICAGShKoqufHmPc7yMU+uDP8gobdZMX95zs6dD8niiov5JaWlJMkQA8QMzMAMzAgGODF+6Yvv8hM3bzN7/ow4PsIHz/2797l3+y6xawlJhrSf4nNl0YwxH+iiUicpzdaU3bcCUkdyB4jQBRhtTXlS93iyNsS3NNmQSlJu/9xXGJ0fc/x0QVOkiLwm+C00Rq6ZGaYKKP5Lbz342lBqfuPnvkxVLgl5j9npCcnOmMwHHOBDIEhBPz/lRLa5kgGK0FqkVeO8TSmyDNkdI7tTyvE2J/mU75U5Z22CmoIAiSfLPD+zG7i/P+Dk+CU7O/vMLs+ZbZa4ZIqJYaqYKWD4f/6FD7722bff4mhvG6fG+fk56dGbjAc7aFSc96w3K0bZktbDSz8BCagZZoqZp1HhojbmscezxnFSO2aVo1VBzTAxXPAkacpB3/HuqERI2Jls8/yHz7h5eI/H3/8YwojOp6CKmaFquHVU/uGH72AaqTcr2Drg6vyKolpRR6WJkdEwp9M1x3Xg5WXF1bqkbI1IQsShXghZTicBi4JFQfl7zuFCIElzQpIRQuB+v0ZQnDfyXoJZR556fvL9t6muHuJji5iAAWa4X/6N32R2OacQjwxH+PUF+uhbVGWBmmEI0DDoe1ItiAoxCp1CVFDARHDeI97hfECcxzmH956QJPiQ4JOUUeLZdS0gOAdJ4rj/xm2Wqzk39vbomhltU6BqmCoYuOFkSpUKIfG4kPHkyVP+y8PvE5IBqooDtFzQSkvmjF61JDXFobRqKA5cCuJxzuG9x3uPJB6CB+8hOHAw9S1BOn5EwYmxvz+lbdbgwalHY0GjLdEi0SLh8vyc9fwcXJ9LCn7/T7/BT33hS3QGQQ2IFOUFrnIIRogVnYcaozVw4vgxM8MAcYIT4ZoqGCAKg1Bi0VA1NCqqkSSFLPO0bY2zNVvjl/R31tBEtGkIq7LlpAqE0Q4ffet/ouq4fXiD9vg72OgGyY1DcA3e9xiljmiOslUiDnBEM66JCNdMwIQfUVWuadNiVcu6KIhDxRAwiNFAHL2eZ3NZo1Yx6pfMj8+ZvVyzc5gTnh6fMnnjQz559Anf/va3SZPA3d0hlDMGzCnLGYU0MG9YtUapI2KvQ4LHMJw41AznHGaGGGD8iFMwVRIVLARexZy9asNW5jCNiAMsMhimLJYdxB4nD+fEznASWL2OhD/8oz8iSQJdZxgJd3e3eTOJuNiwqPqksqCpCmy8TXApTkuka8BSnBOuiQgigmEIgiCYKapG7DqcGqjSSEojPcwqUq8Egdo5lvMVRk7wHiK44PE4roW2bei6DjPDzDi5NL77/IS7PsMSIfWOxBsmQnSC9x4VwUxRATV+RDFUADHUFKJiplyL2uK6Du1qjpdL+qNIdEZdtpw/e8Xq5Iwmv82tW7d5fXFC1u9RFwVtXePef+sIcUIIASeOomnQNKdtImVR0nUtWZqDGWqAC3jvcT4ggKBcMzOumRmqiplhZlwTwAATT7veUJyuaM46WEJunlSENEuY7OxgsaUtVsS2wXuH+7e/9Ut85Sfu40TwPqDOsYoZ1p+yc+99dvempGlGVOEqGohHxCEIIoZg/JiZYWZcU1XMjGsCGJBh9Iol2jQIICKELGOQJ1TrK6qqAFW0U8yUGDtc6gK//Zv/jPffuAk4PI6XL08Z3rlPLzGGmaM3GGFJn6vOsDQlOoepYar8/8wMzBCuKRCJYkQnjIoztKrQtqZta8SUNEnZGm7x8vljnj1/hPOOa04c11xZRYpNwz/9R5/HJALCxfk5WZrAZkFUjwsenyaYCBHoVFFVVA01w8wwM64JgqkhGJgBxjVZF4zajsdPj6mLkqaqiLHDe0/a7/Pi1QmqERFwziEimBlutlhwNtswHY/ZnU4QnxDzQOoFqhVgdKYUTY2a0SFoNDpTOhOiCqoKatApREXM0NhiolhUdF2QAtrUHJ+vOF3WiHM47xHnGOU5/bSPqmJmiAimihi4WdFRdsZyWbG11SNqzdXsgtOXz3DigIB2QlXVaIyIc5iAYhgKoiCKakRVUVVijIBBF7GqRlRJnLF4fYwTYV1FxAkiAqokDnb6CSCIOK45McajPq6qI01dYz7wwc0t7uwO2BQd3/3mR2RpgviEsotcLhc0FommGEanilrELGIWMRQzQ1UxNayLWNdhGnEIIkKWpYh1rKqSru2IMRK7iACjQR/M4Zxja7vP7VuHjAY9HFkGZjTNmi+9fZdf/MqXGeYptydDQt4jimdZFvzg6RNi02FmqBmmCl2EqIgaohG0RazDtEVjhE5BDZIEJJKEDMVhvoe2EdqIRAXn2RnmHOz1ef+9d7h1cEQaAgK40/MLQuixm2Wk+RaHk11+4cs/yXv37uCSlLptOX11yqNPn2KpR1UxVa6ZGaaGqmJqqEZi7NCuI8ZI7CKIoMHhYiRNExIERViXFRqVa0LC1rjPZDLAe0NE+DE3lI5JUPK0R22Oqm052BnRG25heGarOX/znf/Fg/c+j/qUpm5wnSFmOANiJMZIFztijMQYoYtoVCzxuDQllg0+QNpL2a2Eo03gqmxQOkSEIEoqHmdg6ogCKoYB/xtRBxgHmCJ5HwAAAABJRU5ErkJggg=='
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

    case "avatarSet":
      return { ...state, avatar: action.payload };

    case "avatarReset":
      return { ...state, avatar: '' };

    case "notificationAmountSet":
      return { ...state, notificationAmount: action.payload };

    case "resetStore":
      return {...state, token: '', username: '', id: null, lang: 'en', notificationAmount: 0, logged: false};

    default:
      // If the reducer doesn't care about this action type,
      // return the existing state unchanged
      return state;
  }
}
const store = createStore(Reducer);

export default store;