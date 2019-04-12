
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

function cookieName(cookie) {
    return Object.keys(cookie).find((key) => ['domain', 'path', 'expires', 'maxAge', 'secure', 'httpOnly'].includes(key))
}

app.post('/', (req, res) => {
    console.log('=>', req.body)
    const store = req.param('type') === 'client' ? clientCookies : httpCookies
    const entry = req.body
    
    const cookie = cookieParser.parse(entry.cookie)
    normalize(cookie)
    // const cookieToUpdate = store.find(({context, url, cookie: c}) => {
    //     return (context == entry.context || url == entry.url) && 
    //     (cookie.domain == c.domain && cookie.path == c.path && cookieName(cookie) == cookieName(c))
    // })
    // if(!cookieToUpdate) {
        store.push({
            ...entry,
            cookie 
        })
    // }
    
    res.json({status: 'success'})
})

app.get('/', (req, res) => {
    const type = req.param('type') || 'client'
    if(type === 'client') {
        res.json(groupBy(clientCookies, 'context'))
    } else {
        res.json(groupBy(httpCookies, 'url'))
    }
})

app.listen(port, () => console.log(`Cookie Audit Server listening on port ${port}!`))

// Utility functions
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
    if(cookie.hasOwnProperty('Secure')) {
        cookie.secure = cookie.Secure
        delete cookie.Secure
    }
    if(cookie.hasOwnProperty('HttpOnly')) {
        cookie.httpOnly = cookie.HttpOnly
        delete cookie.HttpOnly
    }
    if(cookie.expires || cookie.maxAge) {
        cookie.persistent = true
    }
}

function sevenDaysCaps(cookie) {
    return (cookie.maxAge && cookie.maxAge >= 7 * 24 * 60 * 60) ||
           (cookie.expires && moment(cookie.expires).diff(moment()) >= 7)
    
}

function groupBy(cookies, propName) {
    const group = {}
    cookies.forEach((entry) => {
        const prop = entry[propName]
        group[prop] = group[prop] || []
        const index = group[prop].findIndex((groupEntry) => sameCookie(entry.cookie, groupEntry.cookie))
        if(index != -1) {
            group[prop][index] = entry
        } else {
            group[prop].push(entry)
        }
    })
    return group
}

function sameCookie(cookie1, cookie2) {
    return cookie1.domain == cookie2.domain && cookie1.path == cookie2.path
    && cookieName(cookie1) == cookieName(cookie2)
}