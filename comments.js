const clone = require('clone')
const posts = require('./posts')

let db = {}

const defaultData = {
  "894tuq4ut84ut8v4t8wun89g": {
    id: '894tuq4ut84ut8v4t8wun89g',
    parentId: "8xf0y6ziyjabvozdd253nd",
    timestamp: 1524668353000,
    body: 'Groan!',
    author: 'dawniedarko',
    voteScore: 6,
    deleted: false,
    parentDeleted: false
  },
  "8tu4bsun805n8un48ve89": {
    id: '8tu4bsun805n8un48ve89',
    parentId: "8xf0y6ziyjabvozdd253nd",
    timestamp: 1524681191000,
    body: 'So bad! And so good!',
    author: 'willyshakes',
    voteScore: 2,
    deleted: false,
    parentDeleted: false
  },
  "vi1ecqpdxmn1tbyyfxz2p5": {
    id: 'vi1ecqpdxmn1tbyyfxz2p5',
    parentId: "5tkxad6iwq9svm69fnkblj",
    timestamp: 1520974864000,
    body: 'Dad, I love you but please get off of the internet.',
    author: 'strawberryshortcake',
    voteScore: 10,
    deleted: false,
    parentDeleted: false
  },
  "ffiinnddttqpcntudlskwe": {
    id: 'ffiinnddttqpcntudlskwe',
    parentId: "6ni6ok3ym7mf1p33lnez",
    timestamp: 1524668790000,
    body: '~Polite golf clap~',
    author: 'timmyneutron',
    voteScore: 3,
    deleted: false,
    parentDeleted: false
  },
  "fashjkladsfhsdferughss": {
    id: 'fashjkladsfhsdferughss',
    parentId: "6ni6ok3ym7mf1p33lnez",
    timestamp: 1524668790000,
    body: 'You know what? I like it. Have an upvote.',
    author: 'strawberryshortcake',
    voteScore: 5,
    deleted: false,
    parentDeleted: false
  },
  "1cc0orsdpntn2uy4k1ef1l": {
    id: '1cc0orsdpntn2uy4k1ef1l',
    parentId: "hghgududo38xbwxwoqpddd",
    timestamp: 1517314051000,
    body: 'Classic Willy :-)',
    author: 'timmyneutron',
    voteScore: 9,
    deleted: false,
    parentDeleted: false
  },
  "ur093cbgwukp1jrjdyw9k8": {
    id: 'ur093cbgwukp1jrjdyw9k8',
    parentId: "hghgududo38xbwxwoqpddd",
    timestamp: 1517389211000,
    body: 'Omg I LOVE Hamlet!',
    author: 'strawberryshortcake',
    voteScore: 5,
    deleted: false,
    parentDeleted: false
  },
  "4ijxosa952k7eso2d8no0m": {
    id: '4ijxosa952k7eso2d8no0m',
    parentId: "ttttteeeeefdghjknbvccx",
    timestamp: 1517314051000,
    body: "Your first pun! I'm so proud! <3",
    author: 'timmyneutron',
    voteScore: 10,
    deleted: false,
    parentDeleted: false
  },
  "go8ync8mjvpd92rcjlfoz8": {
    id: 'go8ync8mjvpd92rcjlfoz8',
    parentId: "ttttteeeeefdghjknbvccx",
    timestamp: 1516292601000,
    body: "Daaaaaaaad! :-P",
    author: 'strawberryshortcake',
    voteScore: 8,
    deleted: false,
    parentDeleted: false
  },
  "qy478oqt787b3ot48bvq78": {
    id: 'qy478oqt787b3ot48bvq78',
    parentId: "ri49xb4psrh93lryvn57",
    timestamp: 1518554722000,
    body: "Brevity is the soul of wit. UpVote.",
    author: 'willyshakes',
    voteScore: 11,
    deleted: false,
    parentDeleted: false
  },
  "xey7h5wm3mm1ded2rqxd9q": {
    id: 'xey7h5wm3mm1ded2rqxd9q',
    parentId: "ri49xb4psrh93lryvn57",
    timestamp: 1518564596000,
    body: "I approve.",
    author: 'timmyneutron',
    voteScore: 7,
    deleted: false,
    parentDeleted: false
  },
  "ovax6b0ymlch0imkifi5ba": {
    id: 'ovax6b0ymlch0imkifi5ba',
    parentId: "l1ygl78x9397tvy64ox0z7",
    timestamp: 1520624743000,
    body: "Quality :-)",
    author: 'timmyneutron',
    voteScore: 8,
    deleted: false,
    parentDeleted: false
  },
  "az600jthibhnmvd3cbzf5m": {
    id: 'az600jthibhnmvd3cbzf5m',
    parentId: "1n9ll87bjkzzy13ilg9quh",
    timestamp: 1523460742000,
    body: "Omg whyyyyyyyy",
    author: 'dawniedarko',
    voteScore: 8,
    deleted: false,
    parentDeleted: false
  }
}

function getData (token) {
  let data = db[token]
  if (data == null) {
    data = db[token] = clone(defaultData)
  }
  return data
}

function getByParent (token, parentId) {
  return new Promise((res) => {
    let comments = getData(token)
    let keys = Object.keys(comments)
    filtered_keys = keys.filter(key => comments[key].parentId === parentId && !comments[key].deleted)
    res(filtered_keys.map(key => comments[key]))
  })
}

function get (token, id) {
  return new Promise((res) => {
    const comments = getData(token)
    res(
      comments[id].deleted || comments[id].parentDeleted
        ? {}
        : comments[id]
      )
  })
}

function add (token, comment) {
  return new Promise((res) => {
    let comments = getData(token)

    comments[comment.id] = {
      id: comment.id,
      timestamp: comment.timestamp,
      body: comment.body,
      author: comment.author,
      parentId: comment.parentId,
      voteScore: 1,
      deleted: false,
      parentDeleted: false
    }

    posts.incrementCommentCounter(token, comment.parentId, 1)
    res(comments[comment.id])
  })
}

function vote (token, id, option) {
  return new Promise((res) => {
    let comments = getData(token)
    comment = comments[id]
    switch(option) {
        case "upVote":
            comment.voteScore = comment.voteScore + 1
            break
        case "downVote":
            comment.voteScore = comment.voteScore - 1
            break
        default:
            console.log(`comments.vote received incorrect parameter: ${option}`)
    }
    res(comment)
  })
}

function disableByParent (token, post) {
    return new Promise((res) => {
        let comments = getData(token)
        keys = Object.keys(comments)
        filtered_keys = keys.filter(key => comments[key].parentId === post.id)
        filtered_keys.forEach(key => comments[key].parentDeleted = true)
        res(post)
    })
}

function disable (token, id) {
    return new Promise((res) => {
      let comments = getData(token)
      comments[id].deleted = true
      posts.incrementCommentCounter(token, comments[id].parentId, -1)
      res(comments[id])
    })
}

function edit (token, id, comment) {
    return new Promise((res) => {
        let comments = getData(token)
        for (prop in comment) {
            comments[id][prop] = comment[prop]
        }
        res(comments[id])
    })
}

module.exports = {
  get,
  getByParent,
  add,
  vote,
  disableByParent,
  disable,
  edit
}
