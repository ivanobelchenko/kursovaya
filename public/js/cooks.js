let table = document.getElementById('orders-table');

async function getCooksAndKitchens() {
  let cooksJSON = await fetch('/getCooks');
  let cooks = await cooksJSON.json();
  let kitchensJSON = await fetch('/getKitchens');
  let kitchens = await kitchensJSON.json();
  
  for (let i = 0; i < cooks.length; i++) {
    table.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${cooks[i].username}</td>
        <td>${kitchens[i].model} ${kitchens[i].number}</td>
        <td>${cooks[i].isBusy ? "Да" : "Нет"}</td>
      </tr>
    `);
  }
  
}

getCooksAndKitchens();