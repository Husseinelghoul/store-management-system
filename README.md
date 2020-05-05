# Store Management System for CMPS277
### Tech

We use a number of open source projects to work properly:
* [MySQL]
* [Pug] 
* [Bootstrap]
* [node.js]
* [Express]
* [jQuery]

### Installation
requires [Node.js](https://nodejs.org/) to run.
Install the dependencies and devDependencies and start the server.

```sh
$ npm install -d
$ nodemon
```

add a `nodemon.json` file in root directory with the following config:
```json
{
    "env": {
        "CLEARDB_DATABASE_URL": ""
    },
    "ext": "js pug"
}
```

   [MySQL]: <http://mysql.com>
   [Pug]: <http://pugjs.org>
   [node.js]: <http://nodejs.org>
   [Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [express]: <http://expressjs.com>
