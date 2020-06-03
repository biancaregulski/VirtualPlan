const calendar = document.querySelector("#app-calendar");
const weekDiv = document.querySelector("#day-of-week");

var calBoxColor = getComputedStyle(document.body).getPropertyValue("--color-calendar-box");
var hoverCalBoxColor = "palegreen";

var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

for (let i = 0; i < days.length; i++) {
  let divElement = document.createElement("div");
  divElement.className = "day-name";
  divElement.appendChild(document.createTextNode(days[i]));
  weekDiv.appendChild(divElement);
}

for (let i = 1; i < 31; i++) {
  let pElement =  document.createElement("p");
  pElement.className = "day-number";
  pElement.appendChild(document.createTextNode(i));

  let divElement = document.createElement("div");
  divElement.className = "day";
  divElement.appendChild(pElement);

  divElement.onclick = function () {
    if (this.style.backgroundColor == hoverCalBoxColor) {
      this.style.backgroundColor = calBoxColor;
    }
    else {
      this.style.backgroundColor = hoverCalBoxColor;
    }
  };
  
  calendar.appendChild(divElement);
}