const COHORT = "2310-GHP-ET-WEB-FT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    state.events = data.data;
  } catch (error) {}
}

async function addEvent(event) {
  event.preventDefault();
  try {
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
    form.reset();
    render();
  } catch (error) {
    console.log(error);
  }
}

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

function createDataRow(name, description, location, date, id) {
  // creating a new row
  const row = document.createElement("tr");

  // Do I have this data row already in my table?
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

  // setting a date column
  const dateObject = new Date(date);
  const day = dateObject.toLocaleDateString();

  const tdDate = document.createElement("td");
  const dateText = document.createTextNode(day);
  tdDate.appendChild(dateText);
  row.appendChild(tdDate);

  // setting the time column
  const tdTime = document.createElement("td");
  const timeText = document.createTextNode(formatTime(dateObject));
  tdTime.appendChild(timeText);
  row.appendChild(tdTime);

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

function formatTime(date) {
  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  const isPM = date.getHours() > 12 === true;
  return `${hours}:${minutes} ${isPM ? "pm" : "am"}`;
}

async function removeEvent(event) {
  event.preventDefault();
  try {
    await fetch(API_URL + `/${event.target.value}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const deletedRow = document.getElementById(event.target.value);
    deletedRow.remove();
    render();
  } catch (error) {
    console.log(error);
  }
}

window.addEventListener("load", () => {
  render();
  const form = document.querySelector("form");
  form.addEventListener("submit", addEvent);
});
