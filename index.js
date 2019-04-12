
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie');
const moment = require('moment')

const app = express()
const port = 9000

app.use(bodyParser.json());
app.use(cors());

const clientCookies = []
const httpCookies = []

function normalize(cookie) {
    if(cookie.hasOwnProperty('Domain')) {
        cookie.domain = cookie.Domain
        delete cookie.Domain
    }
    if(cookie.hasOwnProperty('Path')) {
        cookie.path = cookie.Path
        delete cookie.Path
    }
    if(cookie.hasOwnProperty('Expires')) {
        cookie.expires = cookie.Expires
        delete cookie.Expires
    }
    if(cookie.hasOwnProperty('Max-Age')) {
        cookie.maxAge = cookie['Max-Age']
        delete cookie['Max-Age']
    }
    if(cookie.expires || cookie.maxAge) {
        cookie.persistent = true
    }
}

app.post('/', (req, res) => {
    console.log('=>', req.body)
    const store = req.param('type') === 'client' ? clientCookies : httpCookies
    const entry = req.body
    
    const cookie = cookieParser.parse(entry.cookie)
    normalize(cookie)
    store.push({
        ...entry,
        cookie 
    })
    
    res.json({status: 'success'})
})

function sevenDaysCaps(cookie) {
    return (cookie.maxAge && cookie.maxAge >= 7 * 24 * 60 * 60) ||
           (cookie.expires && moment(cookie.expires).diff(moment()) >= 7)
    
}

app.get('/', (req, res) => {
    const type = req.param('type') || 'client'
    const cookies = type === 'client' ? clientCookies : httpCookies;
    res.json(cookies)
})

app.listen(port, () => console.log(`Cookie Audit Server listening on port ${port}!`))
