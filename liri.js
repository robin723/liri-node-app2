var keys = require('./keys.js');
var fs = require('fs');

var action = process.argv[2];
var mediaQuery;		//Holds either the movie name or the song name in the random.txt file

var timeStamp = new Date();
timeStamp = timeStamp.toDateString();

fs.appendFile("log.txt", "\n\n=====================================================\nInquiry Made On " + timeStamp + "\n\n"
	, function(err) {if(err) throw err;});

switch(action) {
	case "my-tweets":
		getTwitter();
		break;
	case "spotify-this-song":
		getSpotify();
		break;
	case "movie-this":
		getMovie();
		break;
	case "do-what-it-says":
		analyzeFile();
		break;
}

function analyzeFile() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		
		var dataArr = data.split(", ");

		action = dataArr[0];

		if(dataArr.length > 1) {
			mediaQuery = dataArr[1];
		}

		switch(action) {
			case "my-tweets":
				getTwitter();
				break;
			case "spotify-this-song":
				getSpotify();
				break;
			case "movie-this":
				getMovie();
				break;
		}
	});
}

function getTwitter() {
	var Twitter = require('twitter');

	var client = new Twitter(keys.twitterKeys);
 
	var params = {screen_name: 'moszabo'};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	  if (!error) {
	  	console.log("Here are my last 20 Tweets:");
	  	console.log("");
	  	fs.appendFile("log.txt", "\nHere are my last 20 Tweets: \n ", function(err) {if(err) throw err;});

	  	for(var i = 0; i < 20; i++) {
	  		console.log(tweets[i].text);
	  		console.log("Created At: " + tweets[i].created_at);
	  		console.log("");

	  		fs.appendFile("log.txt", tweets[i].text + "\nCreated At: " + tweets[i].created_at + "\n \n", function(err) {if(err) throw err;});
	  	}
	  } else {
	  	console.log(error);
	  }
	});
}

function getSpotify() {
	var spotify = require('spotify');
	var song = mediaQuery;
	
	if(song == null) {
		song = process.argv[3];

		for(var i = 4; i < process.argv.length; i++) {
			song = song + " " + process.argv[i];
		}
	}
	
	if(song == null) {
		console.log("You didn't input a song so we are defaulting to What's My Age Again by Blink 182");
		song = "What's My Age Again";
	}


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

	 	fs.appendFile("log.txt", "\nSong Name: " + data.tracks.items[0].name + "\nArtist: " +
	 		data.tracks.items[0].artists[0].name + "\nAlbum: " + data.tracks.items[0].album.name +
	 		"\nPreview Link: " + data.tracks.items[0].preview_url, function(err) {if(err) throw err;});
	});
}

function getMovie() {
	var request = require('request');
	var movie = mediaQuery;

	if(movie == null) {
		movie = process.argv[3];

		for(var i = 4; i < process.argv.length; i++) {
			movie = movie + " " + process.argv[i];
		}
	}

	if(movie == null) {
		console.log("You didn't input a movie so we are defaulting to Mr. Nobody");
		movie = "Mr. Nobody";
	}

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

			fs.appendFile("log.txt", "\nTitle: " + JSON.parse(body)["Title"] + "\nYear: " + JSON.parse(body)["Year"] +
				"\nIMDB Rating: " + JSON.parse(body)["imdbRating"] + "\nCountry: " + JSON.parse(body)["Country"] +
				"\nLanguage: " + JSON.parse(body)["Language"] + "\nPlot: " + JSON.parse(body)["Plot"] +
				"\nActors: " + JSON.parse(body)["Actors"] + "\nRotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"] +
				"\nRotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"], function(err) {if(err) throw err;});
		} else {
			console.log(error);
		}
	})
}