const fs = require('fs');
const data = require('./expense-manager-eacea-export');

Object.keys(data.users).forEach((user) => {
  Object.keys(data.users[user].data).forEach((key) => {
    data.users[user].data[key].number = parseFloat(data.users[user].data[key].number);
  });
});

Object.keys(data.users).forEach((user) => {
  let Meal = 0;
  let Life = 0;
  let Entertainment = 0;
  let Traffic = 0;
  let Others = 0;
  let Income = 0;

  Object.keys(data.users[user].data).forEach((key) => {
    const type = data.users[user].data[key].type;
    const number = data.users[user].data[key].number;
    // Expense += parseInt(number);
    switch (type) {
      case 'Meal':
        Meal += parseFloat(number);
        break;
      case 'Life':
        Life += parseFloat(number);
        break;
      case 'Traffic':
        Traffic += parseFloat(number);
        break;
      case 'Entertainment':
        Entertainment += parseFloat(number);
        break;
      case 'Others':
        Others += parseFloat(number);
        break;
      default:
        Income += parseFloat(number);
        break;
    }
  });
  data.users[user].count = { Meal, Life, Traffic, Entertainment, Others, Income };
});

Object.keys(data.users).forEach((user) => {
  delete data.users[user].count.Expense;
});

const dictstring = JSON.stringify(data);
fs.writeFile('./expense-manager-eacea.json', dictstring, (err) => {
  if (err) { console.log(err); } else { console.log('Write operation complete.'); }
});
