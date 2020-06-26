/* 
Virtual Plan
Code by Bianca Regulski
Released under the public domain
*/

/*
TODO:
- fade out from modals
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

const seasonColors = [getComputedStyle(document.body).getPropertyValue("--color-spring"),
							getComputedStyle(document.body).getPropertyValue("--color-summer"),
							getComputedStyle(document.body).getPropertyValue("--color-fall"),
							getComputedStyle(document.body).getPropertyValue("--color-winter")];

const seasonColorsLight = [getComputedStyle(document.body).getPropertyValue("--color-spring-light"),
							getComputedStyle(document.body).getPropertyValue("--color-summer-light"),
							getComputedStyle(document.body).getPropertyValue("--color-fall-light"),
							getComputedStyle(document.body).getPropertyValue("--color-winter-light")];

const seasonColorsDark = [getComputedStyle(document.body).getPropertyValue("--color-spring-dark"),
							getComputedStyle(document.body).getPropertyValue("--color-summer-dark"),
							getComputedStyle(document.body).getPropertyValue("--color-fall-dark"),
							getComputedStyle(document.body).getPropertyValue("--color-winter-dark")];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];

var days = [];

var todayDate, todayMonth, todayYear, numDays, firstDayOfWeek;
var displayMonth, displayYear;
var monthsSince1970;			// keep track of months since 1970 for 2d array of days

var today = new Date();
var tzHourOffset = Math.round(today.getTimezoneOffset() / 60) + 1;		// adjust for time zone
updateTodayVariables();

// start first day as day 1 of current month.year
var firstDay = new Date(todayYear, todayMonth, 1);
updateFirstDayVariables();

changeCalendarColor(seasonColors[getSeason()]);

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
	monthsSince1970 = 0 - displayMonth + (12 * (1970 - displayYear));	
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
  else  return 3;    // winter
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
    changeCalendarColor(seasonColors[getSeason()]);
  }
}

// change calendar to next month
document.getElementById("forward-arrow").onclick = function() {
	firstDay.setMonth(displayMonth + 1);
	updateFirstDayVariables();
	updateMonth();
	// if going to a month where the season changes, change color to match season
	if (displayMonth % 3 == 2) {
	  changeCalendarColor(seasonColors[getSeason()]);
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
var modalShow = document.getElementById("modal-show");
var modalSave = document.getElementById("modal-save");
var modalDelete = document.getElementById("modal-delete");

var modalArray = [modalAddAlert, modalAdd, modalShow, modalSave, modalDelete];

var addAlertButton = document.getElementById("button-add-ok");
var submitAddButton = document.getElementById("button-add-submit");
var deleteButton = document.getElementById("button-delete");
var saveButton = document.getElementById("button-save");
var cancelButton = document.getElementById("button-cancel");
var okButton = document.getElementById("button-ok");

		
function changeButtonHover(elem) {
	let buttonColorHover = seasonColorsDark[getSeason()];
	elem.style.backgroundColor = buttonColorHover;
}

function revertButtonColor(elem) {
	let buttonColor = seasonColors[getSeason()];
	elem.style.backgroundColor = buttonColor;
}

document.getElementById("button-add-event").onclick = function() {
	let buttonColor = seasonColors[getSeason()];
	document.getElementById("event-add-input").appendChild(document.getElementById("event-time-input"));
	if (getSelectedDays().length == 0) {
		// no selected dates -- show alert message
		addAlertButton.style.backgroundColor = buttonColor;
		alertLabel.innerHTML = "Select one or more days to add an event.";
		modalAddAlert.style.display = "flex";
	} 
	else {
		// display add event modal
		startTimeInput.disabled = false;
		endTimeInput.disabled = false;
		allDayCheckBox.checked = false;			// unchecked by default
		document.getElementById("new-event-title").style.color = buttonColor;
		submitAddButton.style.backgroundColor = buttonColor;
		modalAdd.style.display = "flex";
		addEventForm.reset();
	}
}

addAlertButton.onclick = function() {
	modalAddAlert.style.display = "none";
}

// close modal when its close button is clicked
var closeElements = document.getElementsByClassName("close");
for (let i = 0; i < modalArray.length; i++) {
    closeElements[i].onclick = function(){
		modalArray[i].style.display = "none";
    }
};

// close modal by clicking outside of it
window.onclick = function(event) {
	if (event.target.className == "modal") {
		event.target.style.display = "none";
	}
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

var addEventForm = document.getElementById("form-add-event");
var saveEventForm = document.getElementById("form-save-event");
var alertLabel = document.getElementById("alert-label");
var locationInput = document.getElementById("location-label-input");
var nameInput = document.getElementById("name-label-input");
var eventDivs;

addEventForm.addEventListener("submit", function() {
	event.preventDefault();			// prevents page from reloading
	
	if (startTimeInput.value > endTimeInput.value) {
		let buttonColor = seasonColors[getSeason()];
		addAlertButton.style.backgroundColor = buttonColor;
		alertLabel.innerHTML = "End time cannot be later than start time.";
		modalAddAlert.style.display = "flex";
		return false;
	}
	
	// add event to array of selected days
	let selectedDays = getSelectedDays();	
	let startTime = new Date();					// make this for selectedDays[0]
	let endTime = new Date();
	let timeString;
	
	timeString = generateEventLabel(startTime, endTime);
	
	deselectAllDays();
	
	let eventDivs = [];
	
	for (let i = 0; i < selectedDays.length; i++) {		
		let dayIndex = selectedDays[i];
		let dayNum = selectedDays[i] + 1;
		let dayDiv = document.getElementById("day-" + dayNum.toString());
		// create event object and add to each day's list of objects
		let dayEvent = new Event(eventName.value, locationName.value, 
			new Date(displayYear, displayMonth, dayNum, startTime.getHours(), startTime.getMinutes()), 
			new Date(displayYear, displayMonth, dayNum, endTime.getHours(), endTime.getMinutes()));
					
		let eventDivIndex = eventDivs.push(createEventDiv(dayDiv, dayIndex, eventName.value)) - 1;
		eventDivs[eventDivIndex].id = "event-" + selectedDays[i].toString() + "." + (eventDivIndex + 1).toString();
		
		let selectedDay = days[monthsSince1970][dayIndex];
		let eventIndex = selectedDay.events.push(dayEvent) - 1;			// get index of newly added event
		
		eventDivs[eventDivIndex].onclick = function() { 
			showEvent(dayEvent, eventDivs, eventDivIndex, dayIndex); 
		};
		
		dayDiv.appendChild(eventDivs[eventDivIndex]);		
	}
	modalAdd.style.display = "none";
});	

function showEvent(dayEvent, eventDivs, eventDivIndex, dayIndex) {
	// show event information from clicking on 
	
	let dateArray = [dayEvent.start.getMonth() + 1, dayEvent.start.getDate(), dayEvent.start.getFullYear()];
	let currentColor = seasonColors[getSeason()];			
	
	let startString = dayEvent.start.getHours().toString().padStart(2, '0') + ':' + 
	dayEvent.start.getMinutes().toString().padStart(2, '0');
	let endString = dayEvent.end.getHours().toString().padStart(2, '0') + ':' + 
	dayEvent.end.getMinutes().toString().padStart(2, '0');
	
	document.getElementById("event-show-input").appendChild(document.getElementById("event-time-input"));
	
	document.getElementById("date-info").innerHTML = dateArray.join("-");

	nameInput.value = dayEvent.name;
	locationInput.value = dayEvent.loc;
	startTimeInput.value = startString;
	endTimeInput.value = endString;
	
	deleteButton.style.backgroundColor = currentColor;
	saveButton.style.backgroundColor = currentColor;
	modalShow.style.display = "flex";
	
	cancelButton.style.backgroundColor = currentColor;
	okButton.style.backgroundColor = currentColor;
	
	// prevent clicking on event to affect selection of day box underneath
	if (!e) var e = window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	
	saveEventForm.addEventListener("submit", function() {
		event.preventDefault();			// prevents page from reloading
		
		// display save alert message
		modalSave.style.display = "flex";
		document.getElementById("save-buttons").appendChild(document.getElementById("buttons-cancel-ok"));
		
		cancelButton.onclick = function() {
			modalSave.style.display = "none";
		}
		
		okButton.onclick = function() {
			// update values in days array
			dayEvent.name = nameInput.value;
			dayEvent.loc = locationInput.value;
			
			
			// TODO: start/end error checking
			timeString = generateEventLabel(dayEvent.start, dayEvent.end);
			
			// update values on visible calendar event
			let labelArray = [dayEvent.name, " @ ", timeString];		
			eventDivs[eventDivIndex].innerHTML = labelArray.join("");
			
			modalSave.style.display = "none";
			modalShow.style.display = "none";
		}
	});
	
	deleteButton.onclick = function() {
		event.preventDefault();			// prevents page from reloading
		
		// display delete alert message
		modalDelete.style.display = "flex";
		document.getElementById("delete-buttons").appendChild(document.getElementById("buttons-cancel-ok"));
		
		cancelButton.onclick = function() {
			modalDelete.style.display = "none";
		}
		
		okButton.onclick = function() {
			days[monthsSince1970][dayIndex].events.splice(eventDivIndex, 1);		// remove from array
			eventDivs[eventDivIndex].remove();								// remove from calendar
			
			modalDelete.style.display = "none";
			modalShow.style.display = "none";
		}
	}
}

function saveEvent() {
	
}

function deleteEvent() {
	
}

function createEventDiv(dayDiv, dayNum, eventNameText) {
	let eventDiv = document.createElement("div");
	eventDiv.className = "event";
	
	// display event with event name and starting hour/minute
	let labelArray = [eventNameText, " @ ", timeString];
	eventDiv.innerHTML = labelArray.join("");
	eventDiv.style.backgroundColor = seasonColorsLight[getSeason()];

	return eventDiv;
}

function generateEventLabel(start, end) {
	if (allDayCheckBox.checked || ((startTimeInput.valueAsDate.getHours() + tzHourOffset == 0 || 
		startTimeInput.valueAsDate.getHours() + tzHourOffset == 24) && startTimeInput.valueAsDate.getMinutes() == 0 
		&& endTimeInput.valueAsDate.getHours() + tzHourOffset == 23 && endTimeInput.valueAsDate.getMinutes() == 59)) {
		// all day: start at midnight, end at 23:59
		start.setHours(0);					
		start.setMinutes(0);
		end.setHours(23);
		end.setMinutes(59);
		
		timeString = "all day";
	}
	else {
		start.setHours(startTimeInput.valueAsDate.getHours() + tzHourOffset);					
		start.setMinutes(startTimeInput.valueAsDate.getMinutes());
		end.setHours(endTimeInput.valueAsDate.getHours() + tzHourOffset);
		end.setMinutes(endTimeInput.valueAsDate.getMinutes());
		
		timeString = start.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
	}
	return timeString;
}

function getSelectedDays() {
	let selectedDays = [];
	for (let i = 0; i < days[monthsSince1970].length; i++) {
	   if (days[monthsSince1970][i].selected == true) {
		   selectedDays.push(i);
	   }
	}
	return selectedDays;
}

function updateMonth() {
	document.getElementById("month-year").innerText = months[displayMonth].concat(' ', displayYear);

	// if changing months, remove previous day boxes
	document.querySelectorAll('.day').forEach(function(prevDay) {
		prevDay.remove()
	});
	
	if (typeof days[monthsSince1970] == "undefined") {
		days[monthsSince1970] = [];
	}
	var eventDivs = [];

	let firstDateStarted = false;
	let column = 0;
	let dayDiv, dayNumDiv;
	let i = 0;
	for (let i = 0; i < numDays; i++) {
		if (column % 7 == firstDayOfWeek) {
			let dayIndex = i;
			let dayNum = i + 1;
			let dayNumDiv =  document.createElement("p");
			dayNumDiv.className = "day-number";
			if (todayMonth == displayMonth && todayDate == dayNum) {
				// underline and change color for today's number
				dayNumDiv.style.color = seasonColors[getSeason()];
				dayNumDiv.style.fontWeight = "bold";
				dayNumDiv.style.textDecoration = "underline";
			}
			dayNumDiv.appendChild(document.createTextNode(dayNum));

			dayDiv = document.createElement("div");
			dayDiv.className = "day";
			dayDiv.id = "day-" + dayNum.toString();
			dayDiv.dataset.num = dayNum;
			dayDiv.appendChild(dayNumDiv);

			if (typeof days[monthsSince1970][dayIndex] == "undefined") {					
				// if day not in array, push it
				let newDay = new Day();
				days[monthsSince1970].push(newDay);
			}
			else if (typeof days[monthsSince1970][dayIndex].events !== "undefined") {		
				// display events if array has already been added
				eventDivs[i] = [];
			
				for (let j = 0; j < days[monthsSince1970][dayIndex].events.length; j++) {
					let eventDivIndex = eventDivs[i].push(createEventDiv(dayDiv, dayNum, days[monthsSince1970][dayIndex].events[j].name)) - 1;	
					eventDivs[i][eventDivIndex].id = "event-" + dayNum + "." + (eventDivIndex + 1).toString();
					dayDiv.appendChild(eventDivs[i][eventDivIndex]);	
					eventDivs[i][eventDivIndex].onclick = function() { 
						showEvent(days[monthsSince1970][dayIndex].events[j], eventDivs[i], eventDivIndex, dayIndex);
					}
				}
			}

			// when box is clicked, check if box is selected
			dayDiv.onclick = function() {
				let index = parseInt(this.dataset.num) - 1;
				if (days[monthsSince1970][index].selected == true) {
				  days[monthsSince1970][index].selected = false;
				  this.style.backgroundColor = defaultBoxColor;
				}
				else {
				  days[monthsSince1970][index].selected = true;
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
			i--;
		}
	}
}

function deselectAllDays() {
	var dayElements = document.getElementsByClassName("day");
	for (let i = 0; i < dayElements.length; i++) {
		if (dayElements.item(i).hasAttribute("id")) {
			let index = parseInt(dayElements.item(i).dataset.num) - 1;
			days[monthsSince1970][index].selected = false;
			dayElements.item(i).style.backgroundColor = defaultBoxColor;
		}
	}
}