const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  // Genre: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
  Genre: {
    Name: { type: String, required: true },
    Description: { type: String, required: true },
  },
  // Director: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Director' }],
  Director: {
    Name: { type: String, required: true },
    Bio: String,
    Birth: String,
    Death: String,
  },

  ImagePath: String,
  Feature: Boolean,
});

let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favoriteMovie: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

// let genreSchema = mongoose.Schema({
//   Name: { type: String, required: true },
//   Description: { type: String, required: true },
// });

// let directorSchema = mongoose.Schema({
//   Name: { type: String, required: true },
//   Bio: String,
//   Birth: String,
//   Death: String,
// });

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
// let Genre = mongoose.model('Genre', genreSchema);
// let Director = mongoose.model('Director', directorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
// module.exports.Genre = Genre;
// module.exports.Director = Director;
