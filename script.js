var weatherBaseURL = 'http://api.openweathermap.org/data/2.5/weather?';
var api_key = '&units=imperial&APPID=c290585c590e9e51824e97d5d44f4269';
var weather5daysBaseURL = 'http://api.openweathermap.org/data/2.5/forecast?';

//function that will generate an HTML string and then adds it to the webpage  to display current weather
function createHTML(json_data){
	var location = json_data.name;
	var icon_src = "<img src= 'http://openweathermap.org/img/w/" + json_data.weather[0].icon +".png' style='float:center;'>";
	var description = json_data.weather[0].description;
	var temperature = json_data.main.temp + "F";
	var wind = json_data.wind.speed;
	var htmlString = "<h1>"+ location + "</h1>" + icon_src + "<h2>"+ temperature +"</h2>" + "<li>" + description + "</li>" + "<li> " + wind +"miles/hr </li>" ;
	$('#current_weather_results').empty().prepend(htmlString);

	//  call function to point the location searched on the map
	initialize(json_data.coord.lat,json_data.coord.lon);
}


// function to generate 5 day forecast table and dosplay on the webpage
function create_5_days_html_table(json_data){
	console.log(json_data);
	$('#five_days_weather_results tbody').empty();
	// create table to display 5 days weather forecast
	var date_map = {};
	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
		$.each(json_data.list, function(i, item) {
		var date_str = item.dt_txt.split(" ",1);
		var time_in_seconds = new Date(0);
		var icon_src = "<img src= 'http://openweathermap.org/img/w/" + item.weather[0].icon +"'/>";
		time_in_seconds.setUTCSeconds(item.dt);

		if (!date_map[date_str]){
			date_map[date_str] = 1;
	        var $tr = $('<tr>').append(
	        	$('<td>').text(days[time_in_seconds.getUTCDay()]),
	        	$('<td>').text(item.weather[0].description),
	            $('<td>').text(item.main.temp_min + '  / ' + item.main.temp_max ),
	            $('<td>').text(item.main.pressure),
	            $('<td>').text(item.main.humidity),       
	            $('<td>').text(item.wind.speed),
	        ).appendTo('#five_days_weather_results tbody');
    	}   
    });
}

//function that will execute the current Weather AJAX call 
var searchWeather = function(searchURL){
	console.log("1 day url = " + searchURL);
	$.ajax({
		url: searchURL,
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log("invalid field entry");
			console.log(data.status);
			alert("Invalid field value entered..please check and try again");
		},
		success: function(data){
			//Check the browser console to see the returned data
			console.log(data);
			//Check to make sure the success response is ok
			if (data.cod === '404'){
				alert("Invalid field value entered..please check and try again");
				//adding a return will end the success function
				return;
			}
			//Call a function that will create an HTML string & add it to the page
			createHTML(data);
		}
	});
};

//function that will execute the 5 days forecast Weather AJAX call 
var search5daysWeather = function(searchURL){
	console.log("5 day url = " + searchURL);
	//var searchURL = weather5daysBaseURL + city + api_key;
	$.ajax({
		url: searchURL,
		type: 'GET',
		dataType: 'json',
		error: function(data){
			//console.log("invalid field entry");
			console.log(data.status);
		},

		success: function(data){
			console.log("got 5 days json data");
			
			//Check to make sure the success response is ok
			if (data.cod === '404'){
				//adding a return will end the success function
				return;
			}
			create_5_days_html_table(data);
		}
	});
};

$(document).ready(function(){
	console.log("loaded");

	//Use jQuery to assign a (callback) function to occur when the 'enter' key is pressed

	var searchURL, search5daysURL;	

	$('#city_query').on('keypress', function(e){
		console.log(e.which);
		//If enter key is pressed
		if (e.which == 13){
			var city_val=$("#city_query").val();
			searchURL = weatherBaseURL + "q=" + city_val + api_key;
			search5daysURL = weather5daysBaseURL + "q=" + city_val + api_key;
			searchWeather(searchURL);
			search5daysWeather(search5daysURL);
			$("#city_query").val('');
		}
	});

	$('#zipcode_query').on('keypress', function(e){
		//If enter key is pressed
		if (e.which == 13){
			var zip_val=$("#zipcode_query").val();
			searchURL = weatherBaseURL + "zip=" + zip_val + api_key;
			search5daysURL = weather5daysBaseURL + "zip=" + zip_val + api_key;
			searchWeather(searchURL);
			search5daysWeather(search5daysURL);
			$("#zipcode_query").val('');
		}
	});

	$('#gps_query').on('keypress', function(e){
		//If enter key is pressed
		if (e.which == 13){
			var gps_val = $("#gps_query").val();
			var coords = gps_val.split(",");
			var lat = coords[0];
			var lon = coords[1];
			searchURL = weatherBaseURL + "lat=" + lat + "&lon=" + lon + api_key;
			search5daysURL = weather5daysBaseURL + "lat=" + lat + "&lon=" + lon + api_key;
			searchWeather(searchURL);
			search5daysWeather(search5daysURL);
			$("#gps_query").val('');
		}
	});		
});