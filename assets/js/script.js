function createCityList(citySearchList) {
  $("#city-list").empty();

  var keys = Object.keys(citySearchList);
  for (var i = 0; i < keys.length; i++) {
    var cityListEntry = $("<button>");
    cityListEntry.addClass("list-group-item list-group-item-action");

    var splitStr = keys[i].toLowerCase().split(" ");
    for (var j = 0; j < splitStr.length; j++) {
      splitStr[j] =
        splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
    }
    var titleCasedCity = splitStr.join(" ");
    cityListEntry.text(titleCasedCity);

    $("#city-list").append(cityListEntry);
  }
}

function populateCityWeather(city, citySearchList) {
  createCityList(citySearchList);

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=3330d269f31765515a2e56b4ae85d03c&q=" +
    city;

  var queryURL2 =
    "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=3330d269f31765515a2e56b4ae85d03c&q=" +
    city;

  var latitude;

  var longitude;

  $.ajax({
    url: queryURL,
    method: "GET",
  })
    // Store data inside object
    .then(function (weather) {
      console.log(queryURL);

      console.log(weather);

      var nowMoment = moment();

      var displayMoment = $("<h3>");
      $("#city-name").empty();
      $("#city-name").append(
        displayMoment.text("(" + nowMoment.format("M/D/YYYY") + ")")
      );

      var cityName = $("<h3>").text(weather.name);
      $("#city-name").prepend(cityName);

      var weatherIcon = $("<img>");
      weatherIcon.attr(
        "src",
        "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
      );
      $("#current-icon").empty();
      $("#current-icon").append(weatherIcon);

      $("#current-temp").text("Temperature: " + weather.main.temp + " °F");
      $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
      $("#current-wind").text("Wind Speed: " + weather.wind.speed + " MPH");

      latitude = weather.coord.lat;
      longitude = weather.coord.lon;

      var queryURL3 =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=3330d269f31765515a2e56b4ae85d03c&q=" +
        "&lat=" +
        latitude +
        "&lon=" +
        longitude;

      $.ajax({
        url: queryURL3,
        method: "GET",

        // Display uvIndex inside button
      }).then(function (uvIndex) {
        console.log(uvIndex);

        var uvVal = uvIndex[0].value;
        var uvIndexDisplay = $("<button>");

        if (uvVal <= 2) {
          console.log(uvVal);
          uvIndexDisplay.addClass("btn btn-success");
        } else if (uvVal >= 6) {
          uvIndexDisplay.addClass("btn btn-danger");
        } else {
          vIndexDisplay.addClass("btn btn-warning");
        }

        $("#current-uv").text("UV Index: ");
        $("#current-uv").append(uvIndexDisplay.text(uvIndex[0].value));
        console.log(uvIndex[0].value);

        $.ajax({
          url: queryURL2,
          method: "GET",
        }).then(function (forecast) {
          console.log(queryURL2);

          console.log(forecast);

          // for loop for forecast array to be displayed
          for (var i = 6; i < forecast.list.length; i += 8) {
            var forecastDate = $("<h5>");

            var forecastPosition = (i + 2) / 8;

            console.log("#forecast-date" + forecastPosition);

            $("#forecast-date" + forecastPosition).empty();
            $("#forecast-date" + forecastPosition).append(
              forecastDate.text(nowMoment.add(1, "days").format("M/D/YYYY"))
            );

            var forecastIcon = $("<img>");
            forecastIcon.attr(
              "src",
              "https://openweathermap.org/img/w/" +
                forecast.list[i].weather[0].icon +
                ".png"
            );

            $("#forecast-icon" + forecastPosition).empty();
            $("#forecast-icon" + forecastPosition).append(forecastIcon);

            console.log(forecast.list[i].weather[0].icon);

            $("#forecast-temp" + forecastPosition).text(
              "Temp: " + forecast.list[i].main.temp + " °F"
            );
            $("#forecast-humidity" + forecastPosition).text(
              "Humidity: " + forecast.list[i].main.humidity + "%"
            );

            $(".forecast").attr(
              "style",
              "background-color:dodgerblue; color:white"
            );
          }
        });
      });
    });
}

// Local storage for list of past city searches
$(document).ready(function () {
  var citySearchListStringified = localStorage.getItem("citySearchList");

  var citySearchList = JSON.parse(citySearchListStringified);

  if (citySearchList == null) {
    citySearchList = {};
  }

  createCityList(citySearchList);

  $("#current-weather").hide();
  $("#forecast-weather").hide();

  $("#search-button").on("click", function (event) {
    event.preventDefault();
    var city = $("#city-input").val().trim().toLowerCase();

    // Checks if search field is filled
    if (city != "") {
      citySearchList[city] = true;
      localStorage.setItem("citySearchList", JSON.stringify(citySearchList));

      populateCityWeather(city, citySearchList);

      $("#current-weather").show();
      $("#forecast-weather").show();
    }
  });

  $("#city-list").on("click", "button", function (event) {
    event.preventDefault();
    var city = $(this).text();

    populateCityWeather(city, citySearchList);

    $("#current-weather").show();
    $("#forecast-weather").show();
  });
});
