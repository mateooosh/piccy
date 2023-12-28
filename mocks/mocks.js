const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')

const app = express()
const port = 8000

app.use(bodyParser.json({limit: '20mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.use(cors())

app.listen(port)

const posts = [
  {
    id: 1,
    username: "user1",
    uploadDate: new Date('2022-11-20'),
    liked: true,
    likes: 98,
    comments: 2,
    description: 'Description',
    photo: 'data:image/png;base64,' + toBase64(`./assets/cat-1.jpg`)
  },
  {
    id: 2,
    username: "user1",
    uploadDate: new Date('2022-11-21'),
    liked: false,
    likes: 64,
    comments: 4,
    description: 'Funny cat #cat',
    photo: 'data:image/png;base64,' + toBase64(`./assets/cat-2.jpg`)
  },
  {
    id: 3,
    username: "user1",
    uploadDate: new Date('2022-11-22'),
    liked: false,
    likes: 51,
    comments: 1,
    description: '#cat',
    photo: 'data:image/png;base64,' + toBase64(`./assets/cat-3.jpg`)
  }
]


const users = [{
  id: 1,
  username: 'user1',
  email: 'user1@gmail.com',
  name: 'John Doe',
  photo: 'data:image/png;base64,' + toBase64(`./assets/cat-1.jpg`),
  description: 'Hello, here is my description!',
  postsAmount: 2,
  following: 532,
  followers: 985,
  amIFollowing: true
}, {
  id: 2,
  username: 'user2',
  email: 'user2@gmail.com',
  name: 'Jane Doe',
  photo: 'data:image/png;base64,' + toBase64(`./assets/cat-2.jpg`),
  description: 'My name is Jane Doe',
  postsAmount: 1,
  following: 542,
  followers: 764,
  amIFollowing: false
}]


// -------------------------------------------
// AUTH
// -------------------------------------------
// login
app.post('/auth', (req, res) => {
  res.json({
    message: {
      en: 'Logged successfully.',
      pl: 'Zalogowano pomyślnie.'
    },
    id: 1,
    username: req.body.username,
    token: '1234',
    photo: 'data:image/png;base64,' + toBase64(`./assets/cat-1.jpg`),
    role: 'ADMIN'
  })
})

// register
app.post('/users', (req, res) => {
  res.json({
    message: {
      en: 'Account has been created! Now You can log in.',
      pl: 'Konto zostało utworzone! Teraz możesz się zalogować.'
    },
    variant: 'success',
    created: true
  })
})


// -------------------------------------------
// USERS
// -------------------------------------------
//get users
app.get('/users', (req, res) => res.json(users))

//get user by id
app.get('/users/:id/get', (req, res) => res.json(users[0]))

//follow user
app.post('/users/:id/follow/:idFollower', (req, res) => res.json({message: 'Followed'}))

//unfollow user
app.delete('/users/:id/follow/:idFollower', (req, res) => res.json({message: 'Unfollowed'}))

// search user by username
app.get('/users/:query', (req, res) => {
  res.json(users.filter(user => Object.values(user).some(value => value.includes(req.params.query))))
})

// update user's info
app.put('/users/:id', (req, res) => {
  res.json({
    message: {
      en: 'Changes have been saved!',
      pl: 'Zmiany zostały zapisane!'
    }
  })
})

// get all user's followers
app.get('/followers/:id', (req, res) => res.json(users))

// get all user's following
app.get('/following/:id', (req, res) => res.json(users))

// remove user's account
app.delete('/users/:id', (req, res) => {
  res.json({
    message: {
      en: 'Account has been deleted! You will be logged off.',
      pl: 'Konto zostało usunięte! Nastąpi wylogowanie.'
    }
  })
})


// -------------------------------------------
// POSTS
// -------------------------------------------
// all posts
app.get('/posts', (req, res) => res.json(posts)
)

// get post by id
app.get('/posts/:id', (req, res) => {
  res.json(posts.filter(post => post.id === parseInt(req.params.id)))
})

// create post
app.post('/posts', (req, res) => {
  res.json({
    message: {
      en: 'Post has been created.',
      pl: 'Post został utworzony.'
    }
  })
})

//delete post by id
app.delete('/posts/:id', (req, res) => {
  res.json({
    message: {
      en: 'Post has been removed.',
      pl: 'Post został usunięty.'
    }
  })
})

// get photo by id post
app.get('/posts/:id/photo', (req, res) => {
  const base64String = toBase64(`./assets/cat-${req.params.id}.jpg`)
  const photo = 'data:image/png;base64,' + base64String
  res.json({photo})
})

// like post
app.post('/likes', (req, res) => res.json({message: 'Post has been liked'}))

// dislike post
app.delete('/likes', (req, res) => res.json({message: 'Post has been disliked'}))

// get all users which like post
app.get('/likes/:idPost', (req, res) => {
  res.json([
    {
      idUser: 1,
      username: 'user1',
      name: 'John Doe',
      userPhoto: 'data:image/png;base64,' + toBase64(`./assets/cat-1.jpg`)
    },
    {
      idUser: 2,
      username: 'user2',
      name: 'Jane Doe',
      userPhoto: 'data:image/png;base64,' + toBase64(`./assets/cat-2.jpg`)
    }
  ])
})


// -------------------------------------------
// COMMENTS
// -------------------------------------------
// get comments by idPost
app.get('/comments/:idPost', (req, res) => {
  res.json([
    {
      username: 'user1',
      content: 'Great!'
    }
  ])
})

app.post('/comments/:idPost', (req, res) => {
  res.json({
    message: {
      en: 'Comment has been created',
      pl: 'Komentarz został utworzony'
    }
  })
})


// -------------------------------------------
// REPORTS
// -------------------------------------------
// report bug
app.post('/report/bug', (req, res) => {
  res.json({
    message: {
      en: 'Thank You! Bug has been reported.',
      pl: 'Dziękujemy! Błąd został zgłoszony.'
    }
  })
})

// -------------------------------------------
// TAGS
// -------------------------------------------
// report post
app.post('/reports', (req, res) => {
  res.json({
    message: {
      en: 'Thank You! Post has been reported.',
      pl: 'Dziękujemy! Post został zgłoszony.'
    }
  })
})

// get tags by query
app.get('/tags', (req, res) => res.json(['cat', 'funny', 'kitty']))

// get posts by tags
app.get('/tag/posts', (req, res) => res.json(posts))


// -------------------------------------------
// MESSAGES
// -------------------------------------------
// get messages by idUser
app.get('/messages/:idUser', (req, res) => {
  res.json(
    {
      idChannel: 1,
      users: [users[0], users[1]],
      messages: [
        {
          id: 1,
          idSender: 2,
          message: 'Hej',
          createdAt: new Date(2022, 11, 20, 10, 0, 15)
        },
        {
          id: 2,
          idSender: 1,
          message: 'Hej!',
          createdAt: new Date(2022, 11, 20, 10, 0, 50)
        }
      ]
    }
  )
})

//get channels by idUser
app.get('/channels', (req, res) => {
  res.json([
    {
      lastMessage: 'Hej!',
      idUser: 2,
      idChannel: 1,
      username: 'user2',
      name: 'John Doe',
      createdAt: new Date(2022, 11, 20, 10, 0, 50),
      status: 1
    }
  ])
})


function toBase64(filePath) {
  const img = fs.readFileSync(filePath)
  return Buffer.from(img).toString('base64')
}

