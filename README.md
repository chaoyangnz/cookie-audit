# cookie-audit

A simple server to receive data send by [cookie-collector Chrome Extension](https://github.com/chaoyangnz/cookie-collector) and generate a list of cookies which have risks under the Safari ITP 2.1

## install & run

```
npm install
node index.js
```

## visit http://localhost:9000

The response JSON includes all the cookies set by document.cookies within top frame or any embeded iframes, and HTTP cookies as well.

The client-side cookies are filtered by expires greater than 7 days.
