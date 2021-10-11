//route manage for calls to the API via localhost!
/*
1 - http://localhost:PORT/ = users from london+50mile radius
2 - http://localhost:PORT/users/London = users from London
3 - http://localhost:PORT/users = pulls all 1000 - not relevant for test but needs to be avaliable for calculations 

*/
var express = require('express');
const api = require('../handlers/api-handler');

var router = express.Router();

//hardcoded coords found here (https://www.latlong.net/place/london-the-uk-14153.html#:~:text=The%20latitude%20of%20London%2C%20the,%C2%B0%207'%205.1312''%20W.)
const latitude = 51.509865;
const longitude = 0.118092;

//50 miles of the hard-coded lonlat. 
router.get('/', async function(req, res, next) {
  let usersWithin = await api.getUsersWithin(req.query.latitude || latitude, req.query.longitude || longitude, req.query.distance || 50);
  let usersCity = await api.getUsersInCity(req.query.city || "London");

  //use var not const here to allow for live reassignment 
  var users = usersCity;

  //loop through the array 
  usersWithin.forEach(_user => {
    // IF user is not already pulled from "London" - stopping duplicates
    if (!users.some(user => user.id === _user.id)) {
      users.push(_user);
    }
  });

  res.json(users);
});

// .get to pull users from a 'city' (Reminder: Case Sensitive!!!)
router.get('/users/:city', async function(req, res, next) {
  const city = req.params.city;
  
  let users = await api.getUsersInCity(city);

  res.json(users);
});

// .get to pull all users - potentially store on a temp-db for caching? 
router.get('/users', async function(req, res, next) {
  let users = await api.getAllUsers();

  res.json(users);
});

//allow for calls elsewhere
module.exports = router;
