require("dotenv").config();
var fs = require("fs")
var keys = require("./keys")
var Spotify = require('node-spotify-api')
var moment = require("moment")
var request = require("request")
var spotify = new Spotify(keys.spotify);
var node = process.argv
var search = node[2]
var query = node.slice(3).join(" ")
var divider = "\n---------------------------------------\n\n"

// function that occurs when user is searching if a band is currently touring
if (search === "concert-this") {

    request("https://rest.bandsintown.com/artists/" + query + "/events?app_id=bce0d1862c5720871d002ad5f9124ae6", function (error, response, body) {
        var jsonData = JSON.parse(body)
        if (error) {
            console.log(error)
        } else {
            for (var i = 0; i < jsonData.length; i++) {
                var dateReformat = moment(jsonData[i].datetime).format("MM/DD/YYYY")
                var concertData = [
                    "Venue: " + jsonData[i].venue.name,
                    "Location: " + jsonData[i].venue.city + ", " + jsonData[i].venue.country,
                    "Date: " + dateReformat
                ].join("\n\n")
                console.log(concertData)
                console.log(divider)
            }
        }
    })


} else if (search === "spotify-this-song") {
    spotify.search({ type: 'track', query: query }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var artistsArray = []
        for (i = 0; i < data.tracks.items[0].artists.length; i++) {
            artistsArray.push(data.tracks.items[0].artists[i].name)
        }

        var trackData = [
            "Artist(s): " + artistsArray.join(", "),
            "Song name: " + data.tracks.items[0].name,
            "Link: " + data.tracks.items[0].external_urls.spotify,
            "Album: " + data.tracks.items[0].album.name

        ].join("\n\n")
        console.log(trackData);
        
    });
} else if (search === "movie-this") {
    request("http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        var movieInfo = JSON.parse(body)
        if (error) {
            console.log(error)
        } else {
            var movieData = [
                "Title: " + movieInfo.Title,
                "Year: " + movieInfo.Year,
                "IMDB Rating: " + movieInfo.imdbRating,
                "Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value,
                "Country: " + movieInfo.Country,
                "Language: " + movieInfo.Language,
                "Actors: " + movieInfo.Actors,
                "Plot: " + movieInfo.Plot
            ].join("\n\n")
            console.log(movieData)
            
        }
    })


} 
//Part I couldn't figure out
// else if (search === "do-what-it-says"){
    
//     fs.readFile("random.txt", function(err, data){
//         if (err){
//             console.log(err)
//         }else{
            
//         }
//     })
// }

