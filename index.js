// setting up API URL
const COHORT = "2310-GHP-ET-WEB-FT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

// setting up state
const state = {
  events: [],
};

// calls API to get all events and updates the state
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    state.events = data.data;
  } catch (error) {
    console.log(error);
  }
}

// function to add an event via API
async function addEvent(event) {
  event.preventDefault();
  try {
    // this grabs the form data and manipulating the date and time format
    const form = document.querySelector("form");
    const formData = form.elements;
    const name = formData.theName.value;
    const description = formData.theDescription.value;
    const location = formData.theLocation.value;
    const date = formData.theDate.value;
    const time = formData.theTime.value;
    const dateObject = new Date(`${date}T${time}Z`);
    await fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        description: description,
        location: location,
        date: dateObject,
      }),
    });
    // resets the form and rerenders the table
    form.reset();
    render();
  } catch (error) {
    console.log(error);
  }
}

// the function that renders the table
async function render() {
  const table = document.querySelector("#table");

  await getEvents();
  for (const item of state.events) {
    const row = createDataRow(
      item.name,
      item.description,
      item.location,
      item.date,
      item.id
    );
    // adding new row to table
    if (row) {
      table.appendChild(row);
    }
  }
}

// Creates new row with added data
function createDataRow(name, description, location, date, id) {
  // creating a new row
  const row = document.createElement("tr");

  // Do I have this data row already in my table? Keeps from duplicating rows
  const exists = document.getElementById(id);

  // Since it is undefined it will not add and loop through to the next one
  if (exists) return;

  // setting name column
  const tdName = document.createElement("td");
  const nameText = document.createTextNode(name);
  tdName.appendChild(nameText);
  row.appendChild(tdName);

  // setting description column
  const tdDescription = document.createElement("td");
  const descriptionText = document.createTextNode(description);
  tdDescription.appendChild(descriptionText);
  row.appendChild(tdDescription);

  // setting location column
  const tdLocation = document.createElement("td");
  const locationText = document.createTextNode(location);
  tdLocation.appendChild(locationText);
  row.appendChild(tdLocation);

  // setting a date column  Put the date string into a date object
  const dateObject = new Date(date);
  const formattedDate = dateObject.toLocaleDateString();

  const tdDate = document.createElement("td");
  const dateText = document.createTextNode(formattedDate);
  tdDate.appendChild(dateText);
  row.appendChild(tdDate);

  // setting the time column calling the time format function from below
  const tdTime = document.createElement("td");
  const timeText = document.createTextNode(formatTime(dateObject));
  tdTime.appendChild(timeText);
  row.appendChild(tdTime);

  // creating and adding the listener to the remove for each row with id
  const button = document.createElement("BUTTON");
  const removeText = document.createTextNode("Remove");
  button.value = id;
  button.addEventListener("click", removeEvent);
  button.appendChild(removeText);
  row.appendChild(button);

  // setting unique row id
  row.id = id;

  // returning newly created row
  return row;
}

// function to return the time in a easy to read format
function formatTime(date) {
  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  const isPM = date.getHours() > 12 === true;
  return `${hours}:${minutes} ${isPM ? "pm" : "am"}`;
}

// removes the event when button above is "clicked"
async function removeEvent(event) {
  event.preventDefault();
  // deleting row by button id
  try {
    await fetch(API_URL + `/${event.target.value}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // removing the deleted row and rerendering the table so you don't have to refresh
    const deletedRow = document.getElementById(event.target.value);
    deletedRow.remove();
    render();
  } catch (error) {
    console.log(error);
  }
}

// wait till page is loaded before trying to render table
window.addEventListener("load", () => {
  render();
  const form = document.querySelector("form");
  form.addEventListener("submit", addEvent);
});
