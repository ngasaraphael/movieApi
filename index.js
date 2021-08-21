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
const Genres = Models.Genre;
const Directors = Models.Director;

//bodyParser Middleware for req.param.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 8080;

//Connnect to MongoDB shell
mongoose.connect('mongodb://localhost:27017/movieApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
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

//Route to Data about Genre
app.get('/genres/:genre', (req, res) => {
  Genres.find({ genre: req.params.genre })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Route to Data about Director
app.get('/directors/:Name', async (req, res) => {
  try {
    const director = await Directors.findOne({ Name: req.params.Name });
    res.json(director);
  } catch (err) {
    res.json({ message: 'Info about director could not be accessed' });
  }
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
app.get('/users/:Username', async (req, res) => {
  try {
    const user = await Users.findOne({ username: req.params.Username });
    res.json(user);
  } catch (err) {
    res.json({ message: 'User could not be accessed by username' });
  }
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

//Updating User Info
app.patch('/users/:postid', async (req, res) => {
  try {
    const patchedPost = await Users.updateOne(
      { _id: req.params.postid },
      { $set: { username: req.body.username } }
    );
    res.json(patchedPost);
  } catch (err) {
    res.send({ message: err });
  }
});

//Route for users to add movies to favorite list
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.Username },
    {
      $push: { favoriteMovie: req.params.MovieID },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//Route for users to remove movies from favorite list
app.delete('/users/:Username/movies/delete/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.Username },
    {
      $pull: { favoriteMovie: req.params.MovieID },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//Route to delete user
app.delete('/users/:username', async (req, res) => {
  try {
    const deletedUser = await Users.findOneAndRemove({
      username: req.params.username,
    });
    res.json(deletedUser);
  } catch (err) {
    res.json({ message: 'User could not be deleted' });
  }
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
