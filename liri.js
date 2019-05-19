require("dotenv").config();

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var parm1 = process.argv[2];
var parm2 = process.argv[3];  // currently assuming the 

