//libs
const createError = require('http-errors');
const express = require('express');

// routes folder link
const apiRoute = require("./routes/api.js");

//set app for express use and port number
const app = express();
const PORT = process.env.PORT || 3000;

//MIDDLEWARE - may not need as this will just be GET but may need to POST to api? 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', apiRoute);


//basic 404 call
app.use(function(req, res, next) {
  next(createError(404));
});

//basic error handling - should be more dynamic 
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

//open port - return log
app.listen(PORT, () => {
  console.log(`Listening to requests on port ${PORT}...`);
});

module.exports = app;
