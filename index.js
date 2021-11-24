const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const mongoose = require('mongoose');

//Schema file
const Models = require('./model.js');
//Schemas
const Movies = Models.Movie;
const Users = Models.User;

//bodyParser Middleware for req.param.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

//auth route
let auth = require('./auth')(app);
//passport
const passport = require('passport');
require('./passport');

//Connect to MongoDB Atlass
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connnect to MongoDB shell
//  mongoose.connect('mongodb://localhost:27017/*movieApp', {
//  useNewUrlParser: true,
//  useUnifiedTopology: true});

//morgan middleware to log details
app.use(morgan('common'));

//static routes (e.g to documentation.html)
app.use(express.static('public'));

//Home directory
app.get('/', (req, res) => {
  res.send(
    '<h2>welcome to MovieApi</h2><p>Find API endpoints at https://nameless-retreat-07686.herokuapp.com/documentation.html </p> '
  );
});

/**
 * Get all movies
 * @method GET
 * @param {string} endpoint - endpoint - fetch all movies
 * @returns {object} - returns all movies
 */
app.get(
  '/movies',
  // passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const movies = await Movies.find();
      res.status(201).json(movies);
    } catch (err) {
      res.json({ message: 'Movies could not be accessed' });
    }
  }
);

/**
 * Get movie by title
 * @method GET
 * @param {string} movies - endpoint - fetch movies
 * @param {string} title - endpoint - is used to get specific movie by title
 * @returns {object} - returns a specific movie
 */
app.get(
  '/movies/:title',
  // passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const movie = await Movies.findOne({ Title: req.params.title });
      res.status(201).json(movie);
    } catch (err) {
      res.json({ message: 'Movie could not be accessed' });
    }
  }
);

/**
 * Get movie by genre
 * @method GET
 * @param {string} genre - endpoint - fetch movie by genre
 * @param {string} name - endpoint - is used to get specific genre
 * @returns {object} - returns a specific genre
 */
app.get(
  '/genres/:name',
  // passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find({ ['Genre.Name']: req.params.name })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * Get movie director
 * @method GET
 * @param {string} directors - endpoint - to get directors
 * @param {string} Name - endpoint - is used to get specific director
 * @returns {object} - returns a specific genre
 */
app.get(
  '/directors/:name',
  // passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const director = await Movies.findOne({
        'Director.Name': req.params.name,
      });
      res.json(director);
    } catch (err) {
      res.json({ message: 'Info about director could not be accessed' });
    }
  }
);

/**
 * Get all users
 * @method GET
 * @param {string} users - endpoint - fetch users
 * @returns {object} - returns all users
 */
app.get(
  '/users',
  // passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const users = await Users.find();
      res.status(201).json(users);
    } catch (err) {
      res.json({ message: 'Users could not be accessed' });
    }
  }
);

/**
 * Getspecific user
 * @method GET
 * @param {string} users - endpoint - fetch users
 * @param {string} username - endpoint -  is used to get specific user
 * @returns {object} - returns a specific user
 */
app.get(
  '/users/:username',
  // passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const user = await Users.findOne({ username: req.params.username });
      res.json(user);
    } catch (err) {
      res.json({ message: 'User could not be accessed by username' });
    }
  }
);

/**
 * Register new user
 * @method POST
 * @param {string} users - endpoint - register new user
 */
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
    let hashedPassword = await bcrypt.hash(req.body.password, salt);

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

/**
 * Update user info
 * @method PATCH
 * @param {string} users - endpoint - fetch users
 * @param {string} username -endpoint -  is used to get specific user
 * @returns {object} - returns a new user info
 */
app.patch(
  '/users/:username',
  // passport.authenticate('jwt', { session: false }),
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

    try {
      const patchedPost = await Users.updateOne(
        { username: req.params.username },
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            birthday: req.body.birthday,
          },
        },

        { new: true }
      );
      res.json(patchedPost);
    } catch (err) {
      res.send({ message: err });
    }
  }
);

/**
 * Getfavorite movie
 * @method GET
 * @param {string} movies - endpoint - fetch movies
 * @param {string} id - endpoint - is used to get specific fav movie
 * @returns {object} - returns a specific fav movie
 */
app.get(
  '/movies/favorites/:id',
  // passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const movie = await Movies.findOne({ _id: req.params.id });
      res.status(201).json(movie);
    } catch (err) {
      res.json({ message: 'Movie could not be accessed' });
    }
  }
);

/**
 * Add favorite movie
 * @method POST
 * @param {string} users - endpoint - to users
 * @param {string} username - endpoint - to specific user
 * @param {string} movie - endpoint - to specific movies
 * @param {string} movieID - endpoint - to specific specific movie
 */
app.post(
  '/users/:username/movies/:movieID',
  // passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { username: req.params.username },
      {
        $push: { favoriteMovie: req.params.movieID },
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
  }
);

/**
 * remove favorite movie
 * @method DELETE
 * @param {string} users - endpoint - to users
 * @param {string} username - endpoint - to specific user
 * @param {string} movie - endpoint - to specific movies
 * @param {string} movieID - endpoint - to specific specific movie
 */
app.delete(
  '/users/:username/movies/delete/:movieID',
  // passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { username: req.params.username },
      {
        $pull: { favoriteMovie: req.params.movieID },
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
  }
);

/**
 * Getfavorite movie
 * @method DELETE
 * @param {string} users - endpoint - is used to get users
 * @param {string} username - endpoint -  is used to get specific user
 */
app.delete(
  '/users/:username',
  // passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const deletedUser = await Users.findOneAndRemove({
        username: req.params.username,
      });
      res.json(deletedUser);
    } catch (err) {
      res.json({ message: 'User could not be deleted' });
    }
  }
);

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

//Will delete soon
//CONNECT_URI=mongodb+srv://ngasaraphael:dudumimi79@contactkeeper.582hb.mongodb.net/movieApp?retryWrites=true&w=majority
