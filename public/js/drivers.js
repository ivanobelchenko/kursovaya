let table = document.getElementById('orders-table');

async function getDriversAndCars() {
  let driversJSON = await fetch('/getDrivers');
  let drivers = await driversJSON.json();
  let carsJSON = await fetch('/getCars');
  let cars = await carsJSON.json();
  
  for (let i = 0; i < drivers.length; i++) {
    table.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${drivers[i].username}</td>
        <td>${cars[i].model} ${cars[i].number}</td>
        <td>${drivers[i].isBusy ? "Да" : "Нет"}</td>
      </tr>
    `);
  }
  
}

getDriversAndCars();