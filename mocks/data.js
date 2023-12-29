const fs = require('fs')

function toBase64(filePath) {
  const img = fs.readFileSync(filePath)
  return Buffer.from(img).toString('base64')
}

exports.posts = [
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


exports.users = [{
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