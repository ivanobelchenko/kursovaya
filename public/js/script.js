let navHTML = document.getElementById('nav');
let login = document.getElementById('login');
let register = document.getElementById('register');

if (localStorage.getItem('username') && localStorage.getItem('user_id')) {
  navHTML.insertAdjacentHTML('beforeend', `
    <p><a href="/order">Сделать заказ</a></p>
    <p><a href="/profile">Профиль</a></p>
    <p><a id="logout">Выйти</a></p>
  `);
  login.remove();
  register.remove();
  
  let logout = document.getElementById('logout');
  
  logout.addEventListener('click', _ => {
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    navHTML.appendChild(login);
    navHTML.appendChild(register);
    window.location.reload();
  });
}

