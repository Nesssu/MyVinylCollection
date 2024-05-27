const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {body, validationResult} = require("express-validator");
const config = require('config');

/*

This is where the admin login is done. Also the request to update the
admin credentials can be updated.

*/

// Middleware to authenticate that the user is actually the real admin
const authenticateToken = (req, res, next) =>
{
  const token = req.headers['authorization'];
  if (token == null) return res.status(401).json({success: false, message: "unauthorized: null"});

  jwt.verify(token, 'bananaboat', (err, admin) =>
  {
    if (err) return res.status(401).json({success: false, message: "unauthorized: incorrect"});

    req.admin = admin;
    next();
  })
}

// Login the admin to the admin dashboard
router.post('/login/', (req, res, next) => 
{
  const id = req.body.id;
  const password = req.body.password;

  if (id !== config.get('admin.id'))
  {
    return res.json({success: false, message: "Invalid ID!"});
  }

  bcrypt.compare(password, config.get('admin.password'), (err, isMatch) =>
  {
    if (err) throw err;
    else if (isMatch)
    {
      const payload = {
        id
      }
      jwt.sign(
        payload,
        "bananaboat",
        {
          expiresIn: "12h"
        },
        (err, token) =>
        {
          if (err) 
          {
            throw err;
          }
          else 
          {
            return res.json({success: true, token});
          }
        }
      )
    }
    else
    {
      console.log(password);
      return res.status(401).json({success: false, message: "Invalid password!"});
    }
  })
});

// Update the admins password
router.put('/update/password/', 
  authenticateToken,
  body('password').isStrongPassword({
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1
}),
(req, res, next) =>
{
  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
    return res.json({success: false, message: "Password is not strong enough!"});
  }

  const password = req.body.password;
  const confirmedPassword = req.body.confirmedPassword;

  // Check that the passwords are the same. This check is also done in the client, but this is just to be sure.
  if (password != confirmedPassword)
  {
    return res.json({success: false, message: "The passwords must be the same"});
  }

  bcrypt.genSalt(10, (err, salt) =>
  {
    bcrypt.hash(password, salt, (err, hash) =>
    {
      if (err) return res.json({success: false, message: "Password couldn't be updated because of an error!"});

      config.admin.password = hash;
      return res.json({success: true, message: "Password updated succesfully!"});
      
    })
  });
});

// Update the admin id.
router.put('/update/id/', authenticateToken, (req, res, next) =>
{
  const ID = req.body.ID;
  const confirmedID = req.body.confirmedID;

  if (ID !== confirmedID)
  {
    return res.json({success: false, message: "The IDs must be the same"});
  }

  config.admin.id = ID;
  return res.json({success: true, message: "The admin ID updated succesfully!"});
});

// Validate that the authetication token is correct.
router.post('/validate_token/', (req, res, next) =>
{
  const token = req.body.token;
  let id;

    jwt.verify(token, 'bananaboat', (err, admin) =>
    {
      if (err) return res.status(401).json({success: false});
      if (admin) return res.json({success: true});
    })
});

module.exports = router;
