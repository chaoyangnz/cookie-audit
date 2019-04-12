
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

app.post('/', (req, res) => {
    console.log('=>', req.body)
    const store = req.param('type') === 'client' ? clientCookies : httpCookies
    const entry = req.body
    
    store.push({
        ...entry,
        cookie: cookieParser.parse(entry.cookie)
    })
    
    res.json({status: 'success'})
})

function sevenDaysCaps(cookie) {
    return (cookie.maxAge && cookie.maxAge >= 7 * 24 * 60 * 60) ||
           (cookie.expires && moment(cookie.expires).diff(moment()) >= 7)
    
}

app.get('/', (req, res) => {
    res.json({
        client: clientCookies.filter(({cookie}) => sevenDaysCaps(cookie)),
        http: httpCookies
    })
})

app.listen(port, () => console.log(`Cookie Audit Server listening on port ${port}!`))
