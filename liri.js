require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var Spotify = require("node-spotify-api");

var keys = require("./keys.js");
var spotifyApi = new Spotify(keys.spotify);

//console.log(keys);

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
    if (parm2 == undefined) // default song "The Sign"
    {
        parm2 = "The Sign";
    }
    spotifyThis(parm2);
}

if(parm1 == 'movie-this')
{
    movieThis(parm2);
}

if (parm1 == 'do-what-it-says')
{
    //same stuff called from do what it says - but using the random.txt
    fs.readFile("random.txt", "utf8", function(err, data){
        if (err)
        {
            return console.log(err);
        }
        var command = data.split("\n");
        //get the two parameters action and pick
        parm2 = "'" + parm2 + "'";
        for (i=0; i < command.length; i++) {           
            {
                // set the random pick for the action
                var arrPick = command[i].split(",");                   
                // console.log(arrPick[0]);  
                // console.log(parm2);  
                             
                if(parm2 == arrPick[0])
                {                                   
                    console.log("Reached inside " + arrPick[0]);                       
                    if(arrPick[0] == 'concert-this')
                    {
                        console.log("cond is true");
                        var concert = arrPick[1];
                        concertThis(concert);
                    }

                    if(arrPick[0] == 'movie-this')
                    {
                        var movie = arrPick[1];
                        movieThis(movie);
                    }

                    if(arrPick[0] == 'spotify-this-song')
                    {
                        // call spotify function
                        var track = arrPick[1];
                        spotifyThis(track);
                    }
                }
            }
        }
    });
}

function spotifyThis(track)
{   
    //console.log("Reached in SpotifyThis");
    //Use the Spotify search to look up the track and the information
    var qURL = "https://api.spotify.com/v1/search?q=" + track + "&type=track";
    spotifyApi.search({type: 'track', query: track}, function(err, response)
    {
        if(err) {
            return console.log(errr);
        }
        else
        {
            console.log("Artists: " + response.tracks.items[1].artists[0].name);
            console.log("Song's name: " + response.tracks.items[1].name);
            console.log("Album Name: " + response.tracks.items[1].album.name);
            console.log("Preview Link: " + response.tracks.items[1]. preview_url);
        }
    });   
}

function concertThis(parm2)
{
    var artist = parm2;
    var qURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    //Use the axios search to look up the concert information
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
    //Use the axios search to look up the movie information
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
