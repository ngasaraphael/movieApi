const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
//passport
const verify = require('./passport');
//Schema file
const Models = require('./model.js');
//Schemas
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

//auth route
const auth = require('./auth');

//bodyParser Middleware for req.param.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Connnect to MongoDB shell

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// dotenv.config();
// (initial connect) DB_CONNECT = mongodb+srv://ngasaraphael:dudumimi79@contactkeeper.582hb.mongodb.net/movieApp?retryWrites=true&w=majority
//mongodb://localhost:27017/movieApp (connectionto sheel)
// mongoose.connect(process.env.DB_CONNECT, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

//morgan middleware to log details
app.use(morgan('common'));

//route middleware
app.use('/', auth);

//static routes
app.use(express.static('public'));

//Home directory
app.get('/', (req, res) => {
  res.send('<h1>welcome to MovieApi</h1>');
});

//All movies route
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movies.find();
    res.status(201).json(movies);
  } catch (err) {
    res.json({ message: 'Movies could not be accessed' });
  }
});

//route to Data about single movie route
app.get('/movies/:Title', async (req, res) => {
  try {
    const movie = await Movies.findOne({ Title: req.params.Title });
    res.status(201).json(movie);
  } catch (err) {
    res.json({ message: 'Movie could not be accessed' });
  }
});

//Route to Data about Genre  ****************************************
app.get('/genres/:genre', (req, res) => {
  Genres.find({ Genre: req.body.genre })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Route to Data about Director  **************************************
app.get('/directors/:Name', async (req, res) => {
  try {
    const director = await Directors.findOne({ Name: req.params.Name });
    res.json(director);
  } catch (err) {
    res.json({ message: 'Info about director could not be accessed' });
  }
});

//get all users
app.get('/users', async (req, res) => {
  try {
    const users = await Users.find();
    res.status(201).json(users);
  } catch (err) {
    res.json({ message: 'Users could not be accessed' });
  }
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
app.post(
  '/users',
  [
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail(),
  ],

  async (req, res) => {
    // check the validation object for errors (express validator)
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //Check is user already exist
    const emailExist = await Users.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(400).send('User already exist');
    }

    //Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //register new user
    const user = new Users({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      birthday: req.body.birthday,
    });
    try {
      const savedUser = await user.save();
      res.send(savedUser);
    } catch (err) {
      // res.status(400).send(err);
    }
  }
);

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
app.delete('/users/:username', verify, async (req, res) => {
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
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
