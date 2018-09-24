//get requests go to /blog-posts


//DELETE and PUT requests should go to /blog-posts/:id

//Use Express router and modularize routes to /blog-posts

//need title, content, author:{firstname: lastname: }, 


const mongoose = require('mongoose');
const morgan = require('morgan');
const express = require('express');
mongoose.Promise = global.Promise;


const {DATABASE_URL, PORT} = require('./config');
const {Blog} = require("./models");

const app = express();
app.use(express.json());

app.get('/posts', (req, res) => {
    Blog.find()
    .limit(10)
    .then(blogPosts => {
        res.json({
            blogPosts: blogPosts.map(blogPost => blogPost.serialize())
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    });
});

app.get('posts/:id', (res, res) => {
    Blog.findById(req.params.id)
    .then(blogs => res.json(blogs.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    });
});

app.post('/posts', (req, res) => {
    //have a test to make sure all required fields are entered
    //if not, return 400 status and error message
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    //why don't you have to put date created in there
    Blog.create({
        title: req.body.title,
        content: req.body.content,
        //author was set to full name using virtuals
        author: req.body.author
    })
    .then(blogs => res.status(201).json(blogs.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    });    
});

app.put('/posts/:id', (req, res) => {
    //make sure req.params.id and req.body.id are both present and the same
    if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = `Request path id (${req.params.id}) and request
        body id (${req.body.id}) must match`;
        console.error(message);
        return res.status(400).json({message: message});
    }
    const toUpdate = {};
    const updateableFields = ['title', 'content', 'author'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    Blog
    //update all key: value pairs with req.params.id as id
    //{new: true} ensures the new object t
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
    .then(blogs => res.status(204).end())
    .catch(err => res.status(500).json({message: 'something went wrong'}));
});

app.delete('/posts/:id', (req, res) => {
    Blog
    .findByIdAndRemove(req.params.id)
    .then(() => {
        console.log(`deleted post at id \`${req.params.id}\``);
        res.status(204).end();
    });
});
//catch requests at non existent endpoints and send a message
app.use('*', function(req, res) {
    res.status(404).json({message: "Not Found"});
});
//used to allow closeServer to access a server object
let server;

function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
      mongoose.connect(databaseUrl, err => {
        if (err) {
          return reject(err);
        }
        //listening on PORT
        server = app.listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      });
    });
  }

  function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log("Closing server");
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }
//allow us to run server.js directly with node server.js
  if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
  }
  
  module.exports = { runServer, app, closeServer };