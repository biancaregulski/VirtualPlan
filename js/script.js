class Day {
  constructor() {
    this.selected = false;
  }
}

const calendar = document.querySelector("#app-calendar");
const weekDiv = document.querySelector("#day-of-week");

var defaultBoxColor = getComputedStyle(document.body).getPropertyValue("--color-calendar-box");
var selectedBoxColor = getComputedStyle(document.body).getPropertyValue("--color-calendar-box-hover");

var days = [];
var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

for (let i = 0; i < daysOfWeek.length; i++) {
  let divElement = document.createElement("div");
  divElement.className = "day-name";
  divElement.appendChild(document.createTextNode(daysOfWeek[i]));
  weekDiv.appendChild(divElement);
}

for (let i = 1; i < 31; i++) {
  let pElement =  document.createElement("p");
  pElement.className = "day-number";
  pElement.appendChild(document.createTextNode(i));

  let divElement = document.createElement("div");
  divElement.className = "day";
  divElement.dataset.num = i;
  divElement.appendChild(pElement);

  // create Day object
  let newDay = new Day();
  days.push(newDay);
  
  // when box is clicked, check if box is selected
  divElement.onclick = function () {
    let index = parseInt(this.dataset.num) - 1;
    
    if (days[index].selected == true) {
      days[index].selected = false;
      this.style.backgroundColor = defaultBoxColor;
    }
    else {
      days[index].selected = true;
      this.style.backgroundColor = selectedBoxColor;
    }
/*
    if (this.style.backgroundColor == selectedBoxColor) {
      this.style.backgroundColor = defaultBoxColor;
    }
    else {
      this.style.backgroundColor = selectedBoxColor;
    }*/
  };
  
  calendar.appendChild(divElement);
}