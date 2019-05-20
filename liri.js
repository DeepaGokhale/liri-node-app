require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var Spotify = require("node-spotify-api");

var keys = require("./keys.js");
var spotifyApi = new Spotify(keys.spotify);

var parm1 = process.argv[2];
var parm2 = process.argv[3];  // currently assuming there are only 2 arguments
var curDate = new Date();

//always log for the commands received #Bonus
var log = curDate + " '" + parm1 + "' '" + parm2 + "' \n";
fs.appendFile("log.txt", log, function(err){
    //console.log the error in case file could not be appended
    if (err){
        console.log(err);
    }
    //console.log(curDate);
});

if (parm1 == 'concert-this')
{
    concertThis(parm2);
}

if (parm1 == 'spotify-this-song')
{
    var track = process.argv[3];
    var qURL = "https://api.spotify.com/v1/search?q=" + track + "&type=track";
    spotifyApi.searchTracks(track)
        .then(function(data){
            //play the track
            console.log("Search by track: " + track, data.body);
        })
}

if(parm1 == 'movie-this')
{
    movieThis(parm2);
}

if (parm1 == 'do-what-it-says')
{
    fs.readFile("random.txt", "utf8", function(err, data){
        if (err)
        {
            return console.log(err);
        }
        var command = data.split("\n");

        command.forEach(pick => {
            var arrPick = pick.split(" ");
            if(arrPick[0] == parm2)
            {
                // set the random pick for the action
                parm2 = arrPick[1];
                if(arrPick[0] == 'concert-this')
                {
                    concertThis(parm2);
                }

                if(arrPick[0] == 'movie-this')
                {
                    movieThis(parm2);
                }

                if(arrPick[0] == 'spotify-this-song')
                {
                    // call spotify function
                    spotifyThis(parm2);
                }
            }
        });
        
        console.log(command[randomPick]);
    });
}

function concertThis(parm2)
{
    var artist = parm2;
    var qURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(qURL)
        .then(function(response){
            //log the info 
            response.data.forEach(concert => {               
                console.log("***conert***");
                var dateTime = concert.datetime.split("T");
                console.log("Date: " + dateTime[0] + " " + dateTime[1]);
                console.log("name: " + concert.venue.name);
                console.log("location: " + concert.venue.city + "," + concert.venue.region +  " " + concert.venue.country);
                console.log("latitude, longitude: " + concert.venue.latitude + ", " + concert.venue.longitude);
            });

        });
    }

function movieThis(parm2)
{
    var movieName = parm2;
    var qURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    axios.get(qURL)
        .then(function(response){
            //log the info for following
            var movie = response.data;
            //console.log(movie);
            console.log("Title: " + movie.Title);
            console.log("Year: " + movie.Year);            
            console.log("IMDB Rating: " + movie.imdbRating);
            movie.Ratings.forEach(rating => {
                //check by the source
                if (rating.Source == 'Rotten Tomatoes')
                {
                    console.log("Rotten Tomatoes Rating: " + rating.value);
                }                
            });
             // go by source
            console.log("Country: " + movie.Country);
            console.log("Language: " + movie.Language);
            console.log("Plot: " + movie.Plot);
            console.log("Actors: " + movie.Actors);
        });
}

function spotifyThis(parm2){
    {
        
        
    }
}