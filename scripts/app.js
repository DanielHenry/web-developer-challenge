// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


(function() {
  'use strict';

  var app = {
    isLoading: true,
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container'),
  };


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  document.getElementById('butRefresh').addEventListener('click', function() {
    // Refresh all of the forecasts
    app.updateFeeds();
  });

  document.getElementById('butAdd').addEventListener('click', function() {
    // Open/show the add new city dialog
    app.toggleFilterDialog(true);
  });

  document.getElementById('butAddCity').addEventListener('click', function() {
    // Add the newly selected city
    var select = document.getElementById('selectCityToAdd');
    var selected = select.options[select.selectedIndex];
    var key = selected.value;
    var label = selected.textContent;
    // TODO init the app.selectedCities array here
    app.getForecast(key, label);
    // TODO push the selected city to the array and save here
    app.toggleFilterDialog(false);
  });

  document.getElementById('butAddCancel').addEventListener('click', function() {
    // Close the add new city dialog
    app.toggleFilterDialog(false);
  });


  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Toggles the visibility of the add new city dialog.
  app.toggleFilterDialog = function(visible) {
    if (visible) {
      app.addDialog.classList.add('dialog-container--visible');
    } else {
      app.addDialog.classList.remove('dialog-container--visible');
    }
  };

  // Updates a weather card with the latest weather forecast. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateForecastCard = function(data) {
    var card = app.cardTemplate.cloneNode(true);
    card.classList.remove('cardTemplate');
    card.querySelector('.location').textContent = data.status;
    card.removeAttribute('hidden');
    app.container.appendChild(card);
    app.visibleCards[0] = card;

    card.querySelector('.description').textContent = data.status;
    card.querySelector('.date').textContent = data.status;
    card.querySelector('.current .temperature .value').textContent = data.status;
    card.querySelector('.current .sunrise').textContent = data.status;
    card.querySelector('.current .sunset').textContent = data.status;
    card.querySelector('.current .humidity').textContent = data.status;
    card.querySelector('.current .wind .value').textContent = data.status;
    card.querySelector('.current .wind .direction').textContent = data.status;
    var nextDays = card.querySelectorAll('.future .oneday');
    var today = new Date();
    today = today.getDay();
    for (var i = 0; i < 7; i++) {
      var nextDay = nextDays[i];
      if (nextDay) {
        nextDay.querySelector('.date').textContent =
          app.daysOfWeek[(i + today) % 7];
        nextDay.querySelector('.temp-high .value').textContent = data.status;
        nextDay.querySelector('.temp-low .value').textContent = data.status;
      }
    }
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };


  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  /*
   * Gets a forecast for a specific city and updates the card with the data.
   * getForecast() first checks if the weather data is in the cache. If so,
   * then it gets that data and populates the card with the cached data.
   * Then, getForecast() goes to the network for fresh data. If the network
   * request goes through, then the card gets updated a second time with the
   * freshest data.
   */
  app.getForecast = function(key, label) {
    var statement = 'select * from weather.forecast where woeid=' + key;
    var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' +
        statement;
    // TODO add cache logic here

    // Fetch the latest data.
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          var results = response.query.results;
          results.key = key;
          results.label = label;
          results.created = response.query.created;
          app.updateForecastCard(results);
        }
      } else {
        // Return the initial weather forecast since no data is available.
        app.updateForecastCard(initialWeatherForecast);
      }
    };
    request.open('GET', url);
    request.send();
  };

  // Iterate all of the cards and attempt to get the latest forecast data
  app.updateForecasts = function() {
    var keys = Object.keys(app.visibleCards);
    keys.forEach(function(key) {
      app.getForecast(key);
    });
  };

  // TODO add saveSelectedCities function here

	app.httpGet = function(theUrl){
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", theUrl, false );
		xmlHttp.send( null );
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			return xmlHttp.responseText;
		} else {
			return '{"status":"failed","description":"cannot fetch the response"}';
		}
  }
  
  app.initializeFeed = function(){
		var jsonResponse = app.httpGet('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2Fwwwid');
		var objResponse = JSON.parse(jsonResponse);
		if (objResponse.status=='failed'){
				
		} else {
			//document.getElementById('content').innerHTML = jsonResult;
			var titleTags = document.getElementsByTagName('title');
			titleTags[0].innerHTML = objResponse.feed.title;
	
			var h2Tags = document.getElementsByTagName('h2');
			h2Tags[0].innerHTML = objResponse.feed.title;
	
			var logoTitle = document.getElementById('logotitle');
			logoTitle.innerHTML = objResponse.feed.title;
	
			var rssArray = objResponse.items;
			var parentDivTag = document.getElementById('content');
			for (var i=0; i<rssArray.length; i++){
				var childDivTag = document.createElement('div');
				childDivTag.setAttribute('class','item');
				var imgTag = document.createElement('img');
				imgTag.setAttribute('src',rssArray[i].thumbnail);
				imgTag.setAttribute('width','10%');
				var brTag0 = document.createElement('br');
				var textTag = document.createElement('text');
				textTag.innerHTML = rssArray[i].title;
				childDivTag.appendChild(imgTag);
				childDivTag.appendChild(brTag0);
				childDivTag.appendChild(textTag);
				parentDivTag.appendChild(childDivTag);
				var brTag1 = document.createElement('br');
				var brTag2 = document.createElement('br');
				var brTag3 = document.createElement('br');
				parentDivTag.appendChild(brTag1);
				parentDivTag.appendChild(brTag2);
				parentDivTag.appendChild(brTag3);
			}
		}
  }

  /*
   * Fake weather data that is presented when the user first uses the app,
   * or when the user has not saved any cities. See startup code for more
   * discussion.
   */
  var initialFeedObj = JSON.parse(initialFeed);
  // TODO uncomment line below to test app with fake data
  app.updateForecastCard(initialFeedObj);

  // TODO add startup code here

  // TODO add service worker code here
})();
