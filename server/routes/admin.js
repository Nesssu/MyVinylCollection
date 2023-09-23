const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*

This is where the admin login is done. Also the request to update the
admin credentials can be updated.

*/

// Middleware to authenticate that the user is actually the real admin
const authenticateToken = (req, res, next) =>
{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).send("Unauthorized");

  jwt.verify(token, 'bananaboat', (err, user) =>
  {
    if (err) return res.status(401).json({message: "unauthorized"});

    req.user = user;
    next();
  })
}

// Login the admin to the admin dashboard
router.post('/login/', (req, res, next) => 
{
  const id = req.body.id;
  const password = req.body.password;

  Admin.findOne({id}).exec().then(admin =>
    {
      if (admin == null)
      {
        return res.json({success: false, message: "Invalid ID!"});
      }

      bcrypt.compare(password, admin.password, (err, isMatch) =>
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
              expiresIn: "4h"
            },
            (err, token) =>
            {
              if (err) throw err;
              else return res.json({success: true, token});
            }
          )
        }
        else
        {
          return res.status(401).json({success: false, message: "Invalid password!"});
        }
      })
    });
});

// Update the admins password
router.put('/api/update/password/', (req, res, next) =>
{
  return req.json({
    message: "Password is updated!"
  });
});

// Update the admin id
router.put('/api/update/id/', (req, res, next) =>
{
  return res.json({
    message: "Id is updated!"
  });
});

module.exports = router;
