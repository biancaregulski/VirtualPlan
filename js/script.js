/* 
Virtual Plan
Code by Bianca Regulski
Released under the public domain
*/

/*
TODO:
- month/day shouldn't overlap buttons
- make month start on the right date
- make month match up to actual month
- make forward and backward button work
- make squares draggable
- fix time zone
- add/delete events to calendar correctly
- use holiday api
*/

class Day {
	constructor() {
		this.selected = false;
		this.events = [];
	}
}

class Event {
	constructor(name, loc, start, end) {
		this.name = name;
		this.loc = loc;
		this.start = start;
		this.end = end;
	}
}

const calendarDiv = document.querySelector("#app-calendar");
const weekDiv = document.querySelector("#day-of-week");
const titleHeaderDiv = document.querySelector("#title-header");

var defaultBoxColor = getComputedStyle(document.body).getPropertyValue("--color-calendar-box");
var selectedBoxColor = getComputedStyle(document.body).getPropertyValue("--color-calendar-box-selected");

const seasonBannerColors = [getComputedStyle(document.body).getPropertyValue("--color-banner-spring"),
							getComputedStyle(document.body).getPropertyValue("--color-banner-summer"),
							getComputedStyle(document.body).getPropertyValue("--color-banner-fall"),
							getComputedStyle(document.body).getPropertyValue("--color-banner-winter")];

const seasonEventColors = [getComputedStyle(document.body).getPropertyValue("--color-event-spring"),
							getComputedStyle(document.body).getPropertyValue("--color-event-summer"),
							getComputedStyle(document.body).getPropertyValue("--color-event-fall"),
							getComputedStyle(document.body).getPropertyValue("--color-event-winter")];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];

var days = [];

var todayDate, todayMonth, todayYear, numDays, firstDayOfWeek;
var displayMonth, displayYear;

var today = new Date();
updateTodayVariables();

// start first day as day 1 of current month.year
var firstDay = new Date(todayYear, todayMonth, 1);
updateFirstDayVariables();

changeCalendarColor(seasonBannerColors[getSeason()]);

displayDaysOfWeek();
updateMonth();


function updateTodayVariables() {
	todayDate = today.getDate();
	todayMonth = today.getMonth();
	todayYear = today.getFullYear();
}

function updateFirstDayVariables() {
	firstDayOfWeek = firstDay.getDay();
	displayMonth = firstDay.getMonth();
	displayYear = firstDay.getFullYear();
	numDays = new Date(displayYear, displayMonth + 1, 0).getDate();
}

function displayDaysOfWeek() {
  for (let i = 0; i < daysOfWeek.length; i++) {
    let divElement = document.createElement("div");
    divElement.className = "day-name";
    divElement.appendChild(document.createTextNode(daysOfWeek[i]));
    weekDiv.appendChild(divElement);
  }
}


function getSeason() {
  if (displayMonth >= 2 && displayMonth <= 4)        return 0;    // spring
  else if (displayMonth >= 5 && displayMonth <= 7)   return 1;    // summer
  else if (displayMonth >= 8 && displayMonth <= 10)  return 2;    // fall
  else                              return 3;    // winter
}

// change days of week color and highlight color
function changeCalendarColor(newcolor) {
  weekDiv.style.backgroundColor = newcolor;
  titleHeaderDiv.style.color = newcolor;
}

// change calendar to previous month
document.getElementById("back-arrow").onclick = function() {
  firstDay.setMonth(displayMonth - 1);
  updateFirstDayVariables();
  updateMonth();
  // if going to a month where the season changes, change color to match season
  if (displayMonth % 3 == 1) {
    changeCalendarColor(seasonBannerColors[getSeason()]);
  }
}

// change calendar to next month
document.getElementById("forward-arrow").onclick = function() {
	firstDay.setMonth(displayMonth + 1);
	updateFirstDayVariables();
	updateMonth();
	// if going to a month where the season changes, change color to match season
	if (displayMonth % 3 == 2) {
	  changeCalendarColor(seasonBannerColors[getSeason()]);
	}
}

document.getElementById("button-login").onclick = function() {
	alert("To be implemented");
}

document.getElementById("button-register").onclick = function() {
	alert("To be implemented");
}

var modalAddAlert = document.getElementById("modal-add-alert");
var modalAdd = document.getElementById("modal-add");
var modalShowEvent = document.getElementById("modal-show");

var addAlertButton = document.getElementById("button-add-alert");
var submitAddButton = document.getElementById("button-add-submit");
var deleteButton = document.getElementById("button-delete");
var saveButton = document.getElementById("button-save");

document.getElementById("button-add-event").onclick = function() {
	let currentColor = seasonBannerColors[getSeason()];
	document.getElementById("event-add-input").appendChild(document.getElementById("event-time-input"));
	if (getSelectedDays().length == 0) {
		// no selected dates -- show alert message
		addAlertButton.style.backgroundColor = currentColor;
		//document.getElementById("event-show-input").appendChild(document.getElementById("event-time-input"));
		modalAddAlert.style.display = "block";
	} 
	else {
		// display add event modal
		allDayCheckBox.checked = false;			// unchecked by default
		document.getElementById("new-event-title").style.color = currentColor;
		submitAddButton.style.backgroundColor = currentColor;
		modalAdd.style.display = "block";
	}
}

addAlertButton.onclick = function() {
	modalAddAlert.style.display = "none";
}

document.getElementsByClassName("close")[0].onclick = function() {
	closeModal();
}

// close modal by clicking outside of it
window.onclick = function(event) {
	if (event.target.className == "modal") {
		event.target.style.display = "none";
	}
}

// TODO: fix this
function closeModal() {
	modalAdd.style.display = "none";
	modalAddAlert.style.display = "none";
	
}

const eventName = document.getElementById("event-name-input");
const locationName = document.getElementById("location-name-input");
const startTimeInput = document.getElementById("time-input-start");
const endTimeInput = document.getElementById("time-input-end");
const allDayCheckBox = document.getElementById("all-day-checkbox");

// enable/disable time inputs according to checkbox state
allDayCheckBox.addEventListener('change', (event) => {
	if (event.target.checked) {
		startTimeInput.disabled = true;
		endTimeInput.disabled = true;
	} 
	else {
		startTimeInput.disabled = false;
		endTimeInput.disabled = false;
	}
});

document.getElementById("form-add-event").addEventListener("submit", function() {
	// TODO: check that start time is before end time
	event.preventDefault();			// prevents page from reloading
	// add event to array of selected days
	let selectedDays = getSelectedDays();	
	let startTime = new Date();					// make this for selectedDays[0]
	let endTime = new Date();
	let timeString;
	if (allDayCheckBox.checked) {
		// all day: start at midnight, end at 23:59
		startTime.setHours(0);					
		startTime.setMinutes(0);
		endTime.setHours(23);
		endTime.setMinutes(59);
		timeString = "all day";
	}
	else {
		// get hours and minutes from time selector
		startTime.setHours(startTimeInput.valueAsDate.getHours());
		startTime.setMinutes(startTimeInput.valueAsDate.getMinutes());
		endTime.setHours(endTimeInput.valueAsDate.getHours());
		endTime.setMinutes(endTimeInput.valueAsDate.getMinutes());
		timeString = startTime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
	}
	for (let i = 0; i < selectedDays.length; i++) {
		let dayDiv = document.getElementById("day-".concat(selectedDays[i].toString()));
		
		let eventDiv = document.createElement("div");
		eventDiv.className = "event";
		
		// display event with event name and starting hour/minute
		let labelArray = [eventName.value, " @ ", timeString];
		eventDiv.innerHTML = labelArray.join("");
		eventDiv.style.backgroundColor = seasonEventColors[getSeason()];
		
		// create event object and add to each day's list of objects
		let dayEvent = new Event(eventName.value, locationName.value, 
			new Date(displayYear, displayMonth, selectedDays[i], startTime.getHours(), startTime.getMinutes()), 
			new Date(displayYear, displayMonth, selectedDays[i], endTime.getHours(), endTime.getMinutes()));
		let index = days[selectedDays[i]].events.push(dayEvent);
		
		eventDiv.onclick = function() {
			// show event information from clicking on labelArray
			let dateArray = [dayEvent.start.getMonth() + 1, dayEvent.start.getDate(), dayEvent.start.getFullYear()];
			let currentColor = seasonBannerColors[getSeason()];
			let eventTitle = document.getElementById("event-title");
			
			eventTitle.style.color = currentColor;
			
			let startString = dayEvent.start.getHours().toString().padStart(2, '0') + ':' + 
			dayEvent.start.getMinutes().toString().padStart(2, '0');
			let endString = dayEvent.end.getHours().toString().padStart(2, '0') + ':' + 
			dayEvent.end.getMinutes().toString().padStart(2, '0');
			
			
			document.getElementById("event-show-input").appendChild(document.getElementById("event-time-input"));
			document.getElementById("location-label-input").value = dayEvent.loc;
			eventTitle.innerHTML = dayEvent.name;
			document.getElementById("date-info").innerHTML = dateArray.join("-");
			document.getElementById("time-input-start").value = startString;
			document.getElementById("time-input-end").value = endString;
			
			deleteButton.style.backgroundColor = currentColor;
			saveButton.style.backgroundColor = currentColor;
			modalShowEvent.style.display = "block";
			
			
			deleteButton.onclick = function() {
				days[selectedDays[i]].events.splice(index, 1);		// remove from array
				eventDiv.remove();
				modalShowEvent.style.display = "none";
			}
		};
		dayDiv.appendChild(eventDiv);
		closeModal();
		
	}
});



function getSelectedDays() {
	let selectedDays = [];
	for (var i = 0; i < days.length; i++) {
	   if (days[i].selected == true) {
		   selectedDays.push(i + 1);
	   }
	}
	return selectedDays;
}

function updateMonth() {
	
	document.getElementById("month-year").innerText = months[displayMonth].concat(' ', displayYear);
	let firstDateStarted = false;
	let column = 0;
	let i = 0;

	// if changing months, remove previous day boxes
	document.querySelectorAll('.day').forEach(function(prevDay){
	prevDay.remove()
	})

	let dayDiv, dayNumDiv;
	while (i < numDays) {
	if (column % 7 == firstDayOfWeek) {
		i++;
		let dayNumDiv =  document.createElement("p");
		dayNumDiv.className = "day-number";
		if (todayMonth == displayMonth && todayDate == i) {
			// underline and change color for today's number
			dayNumDiv.style.color = seasonBannerColors[getSeason()];
			dayNumDiv.style.fontWeight = "bold";
			dayNumDiv.style.textDecoration = "underline";
		}
		dayNumDiv.appendChild(document.createTextNode(i));

		dayDiv = document.createElement("div");
		dayDiv.className = "day";
		dayDiv.id = "day-".concat(i.toString());
		dayDiv.dataset.num = i;
		dayDiv.appendChild(dayNumDiv);

		// create Day object
		let newDay = new Day();
		days.push(newDay);

		// when box is clicked, check if box is selected
		dayDiv.onclick = function() {
			let index = parseInt(this.dataset.num) - 1;
			if (days[index].selected == true) {
			  days[index].selected = false;
			  this.style.backgroundColor = defaultBoxColor;
			}
			else {
			  days[index].selected = true;
			  this.style.backgroundColor = selectedBoxColor;
			}
		};
		calendarDiv.appendChild(dayDiv);
		firstDateStarted = true;
		}
		else {
			dayDiv = document.createElement("div");
			dayDiv.className = "day";
			calendarDiv.appendChild(dayDiv);
			column++;
		}
	}
}