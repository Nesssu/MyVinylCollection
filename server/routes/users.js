const express = require('express');
const router = express.Router();

/*

This is where the admin login is done. Also the request to update the
admin credentials can be updated.

*/


// Login the admin to the admin dashboard
router.get('/login/', (req, res, next) => 
{
  return res.json({
    message: "Logged in!"
  });
});

// Update the admins password
router.put('/update/password/', (req, res, next) =>
{
  return req.json({
    message: "Password is updated!"
  });
});

// Update the admin id
router.put('/update/id/', (req, res, next) =>
{
  return res.json({
    message: "Id is updated!"
  });
});

// Registration for the admin. 
// TODO: Delete after the admin credentials are created.
router.post('/register/', (req, res, next) =>
{
  return res.json({
    message: "Registration is complete!"
  })
})

module.exports = router;
