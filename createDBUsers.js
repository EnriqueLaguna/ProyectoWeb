const fs = require('fs');
let users = [{
    "nombre": "John",
    "apellidos": "Doe",
    "email": "john@gmail.com",
    "password": "doej",
    "fecha": "2000-10-28",
    "sexo": "H",
    "uid": 10001,
    "image": "https://randomuser.me/api/portraits/men/0.jpg"
}];
let year = 1900;
for (let i = 0; i < 100; i++) {
    let gender = (i % 2 > 0) ? 'H' : 'M';
    let id = Math.round(Math.random() * (100 - 10) + 10);
    let correo = '';
    let image = '';
    if (gender === 'H') {
        correo = `correo${i}@gmail.com`;
        image = `https://randomuser.me/api/portraits/men/${i+1}.jpg`;
    } else {
        correo = `correo${i}@iteso.mx`;
        image = `https://randomuser.me/api/portraits/women/${i+1}.jpg`;
    }
    let user = {
        "nombre": `nom-${id}`,
        "apellidos": `app-${id}`,
        "email": `${correo}`,
        "password": "hola123",
        "fecha": `${year}-10-15`,
        "sexo": gender,
        "uid": 10002 + i,
        "image": image
    }
    year++;
    users.push(user);
}
console.table(users);
fs.writeFileSync('./data/users.json',JSON.stringify(users));