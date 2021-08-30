const router = require('express').Router();
const model = require('./model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Users = model.User;

//LOGIN
router.post('login', async (req, res) => {
  //Checking if email exist in db
  const user = await Users.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid Email or Password');

  //Checking if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid Email or Password');

  //AUTH TOKEN
  const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET);

  res.header('auth-token', token).send(token);
});

module.exports = router;
