var keys = require('./keys.js');
var fs = require('fs');
var inquirer = require('inquirer');


var timeStamp = new Date();
timeStamp = timeStamp.toDateString();


function useApp() {
	console.log("");
	inquirer.prompt([
	{
		type: "list",
		message: "What do you want to do?: ",
		choices: ["Twitter", "Music", "Movies", "Exit"],
		name: "action"
	},
	]).then(function (user) {
		fs.appendFile("log2.txt", "\n\n=====================================================\nInquiry Made On " + timeStamp + "\n\n"
			, function(err) {if(err) throw err;});
		
		if(user.action == "Twitter") {
			inquirer.prompt([
			{
				type: "input",
				message: "What is your username?",
				name: "username"
			}
			]).then(function (user) {
				var Twitter = require('twitter');

				var client = new Twitter(keys.twitterKeys);
			 
				var params = {screen_name: user.username};
				client.get('statuses/user_timeline', params, function(error, tweets, response){
				  if (!error) {
				  	console.log("Here are your last 20 Tweets:");
				  	console.log("");
				  	fs.appendFile("log2.txt", "\nHere are the last 20 Tweets of " + user.username + ": \n ", function(err) {if(err) throw err;});

				  	for(var i = 0; i < 20; i++) {
				  		console.log(tweets[i].text);
				  		console.log("Created At: " + tweets[i].created_at);
				  		console.log("");

				  		fs.appendFile("log2.txt", tweets[i].text + "\nCreated At: " + tweets[i].created_at + "\n \n", function(err) {if(err) throw err;});
				  	}
				  	useApp();
				  } else {
				  	console.log(error);
				  }
				});
			});
		} else if(user.action == "Music") {
			inquirer.prompt([
			{
				type: "input",
				message: "What song do you want to look up?",
				name: "song"
			}
			]).then(function (user) {
				var spotify = require('spotify');
				var song = user.song;
				

				spotify.search({ type: 'track', query: song }, function(err, data) {
				    if (err) {
				        console.log('Error occurred: ' + err);
				        return;
				    }

					console.log("");
				    console.log("Song Name: " + data.tracks.items[0].name);
				 	console.log("Artist: " + data.tracks.items[0].artists[0].name);
				 	console.log("Album: " + data.tracks.items[0].album.name);
				 	console.log("Preview Link: " + data.tracks.items[0].preview_url);

				 	fs.appendFile("log2.txt", "\nSong Name: " + data.tracks.items[0].name + "\nArtist: " +
				 		data.tracks.items[0].artists[0].name + "\nAlbum: " + data.tracks.items[0].album.name +
				 		"\nPreview Link: " + data.tracks.items[0].preview_url, function(err) {if(err) throw err;});
				 	useApp();
				});				
			});
		} else if(user.action == "Movies") {
			inquirer.prompt([
			{
				type: "input",
				message: "What movie do you want to look up?",
				name: "movie"
			}
			]).then(function (user) {
				var request = require('request');
				var movie = user.movie;

				var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&r=json&tomatoes=true"

				request(queryURL, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						console.log("");
						console.log("Title: " + JSON.parse(body)["Title"]);
						console.log("Year: " + JSON.parse(body)["Year"]);
						console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
						console.log("Country: " + JSON.parse(body)["Country"]);
						console.log("Language: " + JSON.parse(body)["Language"]);
						console.log("Plot: " + JSON.parse(body)["Plot"]);
						console.log("Actors: " + JSON.parse(body)["Actors"]);
						console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
						console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);

						fs.appendFile("log2.txt", "\nTitle: " + JSON.parse(body)["Title"] + "\nYear: " + JSON.parse(body)["Year"] +
							"\nIMDB Rating: " + JSON.parse(body)["imdbRating"] + "\nCountry: " + JSON.parse(body)["Country"] +
							"\nLanguage: " + JSON.parse(body)["Language"] + "\nPlot: " + JSON.parse(body)["Plot"] +
							"\nActors: " + JSON.parse(body)["Actors"] + "\nRotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"] +
							"\nRotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"], function(err) {if(err) throw err;});
					
					useApp();
					} else {
						console.log(error);
					}
				})
			});
		} else {
			console.log("Good Bye!");

			fs.appendFile("log2.txt", "\nExited App\n", function(err) {if(err) throw err;});
		}
	});
}

useApp();