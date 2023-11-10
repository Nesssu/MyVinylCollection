const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

/*

This is where all the request are made to send and retrieve the vinyl
data from the database.

*/

// Middleware to authenticate that the user is actually the real admin
const authenticateToken = (req, res, next) =>
{
  const token = req.headers['authorization'];
  if (token === null || token === undefined) return res.status(401).json({success: false, message: "unauthorized: null"});

  jwt.verify(token, 'bananaboat', (err, admin) =>
  {
    if (err) return res.status(401).json({success: false, message: "unauthorized: incorrect"});

    req.admin = admin;
    next();
  })
}

// Get all the vinyl record data and pictures from the database.
router.get('/record/all/', (req, res, next) =>
{
  return res.json({
    message: "All the records"
  });
});

// Add new record to the database.
router.post('/add/new/record/', authenticateToken, (req, res, next) => 
{
  const artist = req.body.artist;
  const title = req.body.title;
  const releaseDate = req.body.releaseDate;
  const bio = req.body.bio;
  const image = req.body.image;

  console.log(artist);
  console.log(title);
  console.log(releaseDate);
  console.log(bio);
  console.log(image);

  /*Records.create({
    artist,
    title,
    releaseDate,
    bio,
    image,
    contentType: "image/jpeg"
  })
  .then((doc) => 
  {
    return res.json({success: true, message: "Artist added!"})
  })
  .catch((err) =>
  {
    return res.status(402).json({success: false, message: "Error while adding artist!"})
  });*/

  return res.status(200).json({success: true, message: "Success"});
});

// Edit record by it's name and artist
router.put('/record/update/', (req, res, next) =>
{
  return res.json({
    message: "Record updated!"
  });
});

// Remove a record based on it's name and artist.
router.delete('/record/delete/', (req, res, next) =>
{
  return res.json({
    message: "Record deleted!"
  });
});

module.exports = router;
