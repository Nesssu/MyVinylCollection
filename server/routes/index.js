const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const Records = require('../models/Records');

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
router.get('/records/all/', (req, res, next) =>
{
  Records.find({})
    .then(docs =>
      {
        return res.json({success: true, records: docs})
      })
    .catch(err =>
      {
        return res.json({success: false, message: "Error while fetching the records from the database!"});
      });
});

// Add new record to the database.
router.post('/add/new/record/', authenticateToken, (req, res, next) => 
{
  const artist = req.body.artist;
  const title = req.body.title;
  const releaseDate = req.body.releaseDate;
  const number = req.body.number;
  const image = req.body.image;

  Records.create({
    artist: artist,
    title: title,
    releaseDate: releaseDate,
    number: number,
    image: image,
    contentType: "image/jpeg"
  })
  .then((doc) => 
  {
    return res.json({success: true, message: "Record added!"})
  })
  .catch((err) =>
  {
    return res.status(402).json({success: false, message: "Error while adding the record!"})
  });
});

// Edit record by it's name and artist
router.put('/record/update/', (req, res, next) =>
{
  const filter = { _id: req.body._id };
  const update = { $set: 
    { 
      artist: req.body.artist,
      title: req.body.title,
      releaseDate: req.body.releaseDate,
      number: req.body.number,
      image: req.body.image
    } 
  };

  Records.findOneAndUpdate(filter, update)
  .then((result) =>
  {
    if (result)
    {
      return res.json({success: true, message: "Record updated!"});
    }
  })
  .catch((error) =>
  {
    if (error)
    {
      return res.json({success: false, message: "Error while updating the record!"});
    }
  })
});

// Remove a record based on it's name and artist.
router.delete('/record/delete/', (req, res, next) =>
{
  const number = req.body.number;

  Records.findOneAndRemove({number: number})
  .then((doc) =>
  {
    return res.json({success: true, message: "Record deleted!"});
  })
  .catch((err) => 
  {
    return res.status(403).json({success: false, message: "Error while trying to delete the record"});
  });
});

module.exports = router;
