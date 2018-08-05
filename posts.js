const clone = require('clone')

let db = {}

const defaultData = {
  "8xf0y6ziyjabvozdd253nd": {
    id: '8xf0y6ziyjabvozdd253nd',
    timestamp: 1524621132000,
    title: 'Did you hear about the cross-eyed teacher?',
    body: 'She had trouble controlling her pupils.',
    author: 'timmyneutron',
    category: 'puns',
    voteScore: 30,
    deleted: false,
    commentCount: 2
  },
  "6ni6ok3ym7mf1p33lnez": {
    id: '6ni6ok3ym7mf1p33lnez',
    timestamp: 1524666009000,
    title: "Why couldn't the bike stand up?",
    body: 'Because it was two-tired.',
    author: 'dawniedarko',
    category: 'puns',
    voteScore: 25,
    deleted: false,
    commentCount: 2
  },
  "5tkxad6iwq9svm69fnkblj": {
    id: '5tkxad6iwq9svm69fnkblj',
    timestamp: 1520886708000,
    title: "Did you hear there's a restaurant on the moon?",
    body: "The food is good, but there's not much atmosphere.",
    author: 'timmyneutron',
    category: 'dadjokes',
    voteScore: 21,
    deleted: false,
    commentCount: 1
  },
  "l1ygl78x9397tvy64ox0z7": {
    id: 'l1ygl78x9397tvy64ox0z7',
    timestamp: 1520597505000,
    title: "'I live by the church' 'Art thou a churchman?'",
    body: "No such matter, sir. I do live by the church; for I do live at my house, and my house doth stand by the church.",
    author: 'willyshakes',
    category: 'wordplay',
    voteScore: 13,
    deleted: false,
    commentCount: 1
  },
  "ri49xb4psrh93lryvn57": {
    id: 'ri49xb4psrh93lryvn57',
    timestamp: 1518565474000,
    title: "What did the fish say when it swam into a concrete wall?",
    body: "Dam!",
    author: 'dawniedarko',
    category: 'puns',
    voteScore: 21,
    deleted: false,
    commentCount: 2
  },
  "hghgududo38xbwxwoqpddd": {
    id: 'hghgududo38xbwxwoqpddd',
    timestamp: 1517233343000,
    title: "'Whose grave’s this, sirrah?' 'Mine, sir.'",
    body: "'I think it be thine, indeed, for thou liest in it.' - 'You lie out on it, sir, and therefore it is not yours. For my part, I do not lie in it, and yet it is mine.'",
    author: 'willyshakes',
    category: 'wordplay',
    voteScore: 28,
    deleted: false,
    commentCount: 2
  },
  "ttttteeeeefdghjknbvccx": {
    id: 'ttttteeeeefdghjknbvccx',
    timestamp: 1516287940000,
    title: "What do you call a deer with no eyes?",
    body: "No idear!",
    author: 'strawberryshortcake',
    category: 'puns',
    voteScore: 40,
    deleted: false,
    commentCount: 2
  },
  "1n9ll87bjkzzy13ilg9quh": {
    id: '1n9ll87bjkzzy13ilg9quh',
    timestamp: 1523378061000,
    title: "I watched a car crush a Coke can today.",
    body: "I shouldn't be sad about it, but it was just soda pressing...",
    author: 'timmyneutron',
    category: 'dadjokes',
    voteScore: 32,
    deleted: false,
    commentCount: 1
  },
}

function getData (token) {
  let data = db[token]
  if (data == null) {
    data = db[token] = clone(defaultData)
  }
  return data
}

function getByCategory (token, category) {
  return new Promise((res) => {
    let posts = getData(token)
    let keys = Object.keys(posts)
    let filtered_keys = keys.filter(key => posts[key].category === category && !posts[key].deleted)
    res(filtered_keys.map(key => posts[key]))
  })
}

function get (token, id) {
  return new Promise((res) => {
    const posts = getData(token)
    res(
      posts[id].deleted
        ? {}
        : posts[id]
    )
  })
}

function getAll (token) {
  return new Promise((res) => {
    const posts = getData(token)
    let keys = Object.keys(posts)
    let filtered_keys = keys.filter(key => !posts[key].deleted)
    res(filtered_keys.map(key => posts[key]))
  })
}

function add (token, post) {
  return new Promise((res) => {
    let posts = getData(token)

    posts[post.id] = {
      id: post.id,
      timestamp: post.timestamp,
      title: post.title,
      body: post.body,
      author: post.author,
      category: post.category,
      voteScore: 1,
      deleted: false,
      commentCount: 0
    }

    res(posts[post.id])
  })
}

function vote (token, id, option) {
  return new Promise((res) => {
    let posts = getData(token)
    post = posts[id]
    switch(option) {
        case "upVote":
            post.voteScore = post.voteScore + 1
            break
        case "downVote":
            post.voteScore = post.voteScore - 1
            break
        default:
            console.log(`posts.vote received incorrect parameter: ${option}`)
    }
    res(post)
  })
}

function disable (token, id) {
    return new Promise((res) => {
      let posts = getData(token)
      posts[id].deleted = true
      res(posts[id])
    })
}

function edit (token, id, post) {
    return new Promise((res) => {
        let posts = getData(token)
        for (prop in post) {
            posts[id][prop] = post[prop]
        }
        res(posts[id])
    })
}

function incrementCommentCounter(token, id, count) {
  const data = getData(token)
  if (data[id]) {
    data[id].commentCount += count
  }
}

module.exports = {
  get,
  getAll,
  getByCategory,
  add,
  vote,
  disable,
  edit,
  getAll,
  incrementCommentCounter
}