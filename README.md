# cookie-audit

## install & run

`npm install`
`node index.js`

## visit http://localhost:9000

The response JSON includes all the cookies set by document.cookies within top frame or any embeded iframes, and HTTP cookies as well.

The client-side cookies are filtered by expires greater than 7 days.