const axios = require('axios');
const geolib = require('geolib');

async function getUsersInCity(city) {
  //call and pull data from https://bpdts-test-app.herokuapp.com to store
  const url = "https://bpdts-test-app.herokuapp.com/city/"+city+"/users";
  let resp = await axios.get(url);
  return resp.data;
}

//function to pull all the users and store ready for parsing to check radius
async function getAllUsers() {
  const url = "https://bpdts-test-app.herokuapp.com/users";
  try {
    let resp = await axios.get(url);
    return resp.data;
  } catch (error) {
    return [];
  }
}


async function getUsersWithin(lat, lon, distance) {
    let users = await getAllUsers();

    //store users
    var validUsers = [];
    //move through each stored and run the check function
    users.forEach(user => {
        if (isWithin50Miles(distance, lat, lon, user)) {
            validUsers.push(user);
        }
    });

    //push the valid users to the data response
    return validUsers;
}

module.exports.getUsersWithin = getUsersWithin
module.exports.getUsersInCity = getUsersInCity
module.exports.getAllUsers = getAllUsers

////TODO - make this check work!
//geolib.isPointWithinRadius(
//   { latitude: 51.509865, longitude: 0.118092 }, //hardcoded London coords
//   { latitude: user.latitude, longitude: user.longitude },
//   5000
// );

//function to check the distance from hard-cooded coord - simplified from radial check 
function isWithin50Miles(distance, lat, lon, user) {

  let distanceBetween = geolib.getDistance({ latitude: lat, longitude: lon },
      { latitude: user.latitude, longitude: user.longitude });

  return getMiles(distanceBetween) <= distance;
}

// meters and miles conversion: => sourced (https://stackoverflow.com/questions/20674439/how-to-convert-meters-to-miles)
function getMiles(i) {
     return i*0.000621371192;
}
function getMeters(i) {
     return i*1609.344;
}