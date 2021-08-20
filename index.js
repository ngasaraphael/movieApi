const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
//Schema file
const Models = require('./model.js');
//Schemas
const Movies = Models.Movie;
const Users = Models.User;

//bodyParser Middleware for req.param.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 8080;

//Connnect to MongoDB shell
mongoose.connect('mongodb://localhost:27017/movieApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//morgan middleware to log details
app.use(morgan('common'));

//static routes
app.use(express.static('public'));

//Home directory
app.get('/', (req, res) => {
  res.send('<h1>welcome to MovieApi</h1>');
});

//All movies route
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//route to Data about single movie route
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Route to Data about Genre                            ******
app.get('/movies/:genres', (req, res) => {
  Movies.find({ genres: req.params.Genre })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Route to Data about Director
app.get('/directors/:name', (req, res) => {
  res.send('<h1>This is the info Route about Director </h1>');
});

//get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Route to register new users
app.post('/users', (req, res) => {
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        Users.create({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          birthday: req.body.birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Route to Update users info
app.put('/users/:username', (req, res) => {
  res.send('<h1>This is the Route to Update user info</h1>');
});

//Route for users to add movies to favorite list
app.post('/users/:username/:favorites/:movieID', (req, res) => {
  res.send('<h1>This is the Route to add movie to favorite list</h1>');
});

//Route for users to remove movies from favorite list
app.delete('/users/:username/:favorites/:movieID', (req, res) => {
  res.send('<h1>This is the Route to remove movie from favorite list</h1>');
});

//Route to delete user
app.delete('/users/:username', (req, res) => {
  res.send('<h1>This is the Route to delete user</h1>');
});

//Error handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('An error occur while loading');
});

//port
app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});
