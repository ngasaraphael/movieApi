// const router = require('express').Router();
// const model = require('./model');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// const Users = model.User;

// //LOGIN
// router.post('/login', async (req, res) => {
//   //Checking if email exist in db
//   const user = await Users.findOne({ email: req.body.email });
//   if (!user) return res.status(400).send('Invalid Email or Password');

//   //Checking if password is correct
//   const validPassword = await bcrypt.compare(req.body.password, user.password);
//   if (!validPassword) return res.status(400).send('Invalid Email or Password');

//   //AUTH TOKEN
//   const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET);

//   res.header('auth-token', token).json({ user, token });
// });

// module.exports = router;

const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); // Your local passport file

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username you’re encoding in the JWT
    expiresIn: '7d', // This specifies that the token will expire in 7 days
    algorithm: 'HS256', // This is the algorithm used to “sign” or encode the values of the JWT
  });
};

/* POST login. */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
