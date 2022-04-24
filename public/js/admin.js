let select = document.getElementById('cook_id');
let select_del = document.getElementById('cook_id_delete');

async function getCooksAndOffices() {
  let cooksJSON = await fetch('/getCooks');
  let cooks = await cooksJSON.json();
  
  for (let i = 0; i < cooks.length; i++) {
    select.insertAdjacentHTML('beforeend', `
      <option value="${cooks[i].id}">${cooks[i].username}</option>
    `);
    select_del.insertAdjacentHTML('beforeend', `
      <option value="${cooks[i].id}">${cooks[i].username}</option>
    `);
  }
  
}

getCooksAndOffices();