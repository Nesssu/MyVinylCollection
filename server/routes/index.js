const express = require('express');
const router = express.Router();

/*

This is where all the request are made to send and retrieve the vinyl
data from the database.

*/


// Get all the vinyl record data and pictures from the database.
router.get('/record/all/', (req, res, next) =>
{
  return res.json({
    message: "All the records"
  });
});

// Add new record to the database.
router.post('/record/add/', (req, res, next) => 
{
  return res.json({
    message: "New record added!"
  });
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
