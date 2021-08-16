const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const port = 8080;

let topMovies = [
  {
    title: 'The Shawshank Redemption',
    year: 1994,
    director: 'Frank Darabont',
    duration: '2h 22min',
    genre: ['Crime', 'Drama'],
  },
  {
    title: 'The Godfather',
    year: 1972,
    director: 'Francis Ford Coppola',
    duration: '2h 55min',
    genre: ['Crime', 'Drama'],
  },
  {
    title: 'The Godfather: Part II',
    year: 1974,
    director: 'Francis Ford Coppola',
    duration: '3h 22min',
    genre: ['Crime', 'Drama'],
  },
  {
    title: 'The Dark Knight',
    year: 2008,
    director: 'Christopher Nolan',
    duration: '2h 32min',
    genre: ['Action', 'Crime', 'Drama', 'Thriller'],
  },
  {
    title: '12 Angry Men',
    year: 1957,
    director: 'Sidney Lumet',
    duration: '1h 36min',
    genre: ['Crime', 'Drama'],
  },
  {
    title: 'Schindler"s List',
    year: 1993,
    director: 'Steven Spielberg',
    duration: '3h 15min',
    genre: ['Biography', 'Drama', 'History'],
  },
  {
    title: 'Pulp Fiction',
    year: 1994,
    director: 'Quentin Tarantino',
    duration: '2h 34min',
    genre: ['Crime', 'Drama'],
  },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
    director: 'Peter Jackson',
    duration: '3h 21min',
    genre: ['Adventure', 'Drama', 'Fantasy'],
  },
  {
    title: 'Il buono, il brutto, il cattivo',
    year: 1966,
    director: 'Sergio Leone',
    duration: '3h 2min',
    genre: ['Western'],
  },
  {
    title: 'Fight Club',
    year: 1999,
    director: 'David Fincher',
    duration: '2h 19min',
    genre: ['Drama'],
  },
];

//bodyParser Middleware for req.param.body
app.use(bodyParser.json());

//morgan middleware to log details
app.use(morgan('common'));

//static routes
app.use(express.static('public'));

//All movies route
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//route to Data about single movie route
app.get('/movies/:title', (req, res) => {
  res.send(
    topMovies.find((movie) => {
      return movie.title === req.params.title;
    })
  );
});

//Route to Data about Genre
app.get('/genres/:name', (req, res) => {
  res.send('<h1>This is the genre Route </h1>');
});

//Route to Data about Director
app.get('/directors/:name', (req, res) => {
  res.send('<h1>This is the info Route about Director </h1>');
});

//Route to register new users
app.post('/users', (req, res) => {
  res.send('<h1>This is the Route to Register new Users</h1>');
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
