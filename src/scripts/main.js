import { v4 as uuidv4 } from 'uuid';
import Chart from 'chart.js';
import values from 'lodash/values';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyCms_SUzXe1Ng-a3jv-BsKKLfkXH1JUW6c',
  authDomain: 'expense-manager-eacea.firebaseapp.com',
  databaseURL: 'https://expense-manager-eacea.firebaseio.com',
  projectId: 'expense-manager-eacea',
  storageBucket: 'expense-manager-eacea.appspot.com',
  messagingSenderId: '400660080161',
};
firebase.initializeApp(config);

const database = firebase.database();

let user;
const onAuthState = (callback) => {
  firebase.auth().onAuthStateChanged((auth) => {
    if (auth) {
      user = auth;
      if (callback !== undefined) {
        callback();
      }
    } else {
      user = null;
      window.location = './signin.html';
    }
  });
};

const signin = () => {
  const signinGoogle = document.getElementById('signin-google');
  const signinFacebook = document.getElementById('signin-facebook');

  signinGoogle.addEventListener('click', () => {
    // console.log(firstUser.value);
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(() => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const token = result.credential.accessToken;
        // The signed-in user info.
        // const user = result.user;
        // ...
        // user = result.user;
        // console.log(result.user);
        window.location = './index.html';
      })
      .catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // const credential = error.credential;
        // ...
        console.log(error);
      });
  });

  signinFacebook.addEventListener('click', () => {
    // console.log(firstUser.value);
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(() => {
        // .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const token = result.credential.accessToken;
        // The signed-in user info.
        // const user = result.user;
        // ...
        window.location = './index.html';
      })
      .catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // const credential = error.credential;
        // ...
        console.log(error);
      });
  });
};

function signOutListener() {
  const signOut = document.getElementById('sign-out');
  signOut.addEventListener('click', () => {
    firebase
      .auth()
      .signOut()
      .catch((error) => console.log(error));
  });
}

function writeAccountData(id, title, type, number, date) {
  const accountRef = database.ref(`users/${user.uid}/data/${id}`);

  accountRef.set({ title, type, number, date }, () => {
    window.location = './create.html';
  });
}

function updateData(id, title, type, numberText, date) {
  const number = parseFloat(numberText);

  const accountRef = database.ref(`users/${user.uid}/data/${id}`);

  accountRef.update({ title, type, number, date }, () => {
    window.location = './detail.html';
  });
}

function deleteData(id) {
  // user = firebase.auth().currentUser;
  const accountRef = database.ref(`users/${user.uid}/data/${id}`);

  accountRef.remove(() => {
    window.location = './detail.html';
  });
}

function updateBtnListener() {
  // user = firebase.auth().currentUser;
  const updateBtns = document.querySelectorAll('.update-btn');
  for (let i = 0; i < updateBtns.length; i += 1) {
    // eslint-disable-next-line no-loop-func
    updateBtns[i].addEventListener('click', (e) => {
      e.preventDefault();
      const id = updateBtns[i].getAttribute('data-id');
      const accountRef = database.ref(`users/${user.uid}/data/${id}`);
      accountRef.on('value', (snapshot) => {
        // window.location = '/update.html?id=' + id +
        // '&title=' + snapshot.val().title + '&type=' + snapshot.val().type +
        // '&number=' + snapshot.val().number + '&date=' + snapshot.val().date;
        window.location = `/update.html?id=${id}&title=${
          snapshot.val().title
        }&type=${snapshot.val().type}&cash=${snapshot.val().number}&date=${
          snapshot.val().date
        }`;
      });
    });
  }
}

function deleteBtnListener() {
  const deleteBtns = document.querySelectorAll('.delete-btn');
  for (let i = 0; i < deleteBtns.length; i += 1) {
    deleteBtns[i].addEventListener('click', (e) => {
      e.preventDefault();
      const id = deleteBtns[i].getAttribute('data-id');
      deleteData(id);
    });
  }
}

function loadChart(rawData) {
  const ctxDataChart = document.querySelector('#data-chart');
  const ctxDataIncomeChart = document.querySelector('#data-income-chart');

  const chartData = values(rawData).reduce(
    (acc, cur) => {
      acc[cur.type] += cur.number;
      return acc;
    },
    {
      Income: 0,
      Food: 0,
      Drinks: 0,
      Transportation: 0,
      Shopping: 0,
      Entertainment: 0,
      Housing: 0,
      Electronics: 0,
      Medical: 0,
      Misc: 0,
    }
  );

  console.log(rawData);

  chartData.Expense = values(rawData).reduce((acc, cur) => acc + cur, 0);

  // income and expense chart
  // eslint-disable-next-line no-new
  new Chart(ctxDataIncomeChart, {
    data: {
      labels: ['Income', 'Expense'],
      datasets: [
        {
          data: [chartData.Income, chartData.Expense],
          backgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    },
    type: 'doughnut',
    options: {
      maintainAspectRatio: false,
    },
  });

  // expenses chart
  // eslint-disable-next-line no-new
  new Chart(ctxDataChart, {
    data: {
      labels: ['Food', 'Transportation', 'Shopping', 'Entertainment', 'Misc.'],
      datasets: [
        {
          label: '',
          data: [
            chartData.Food,
            chartData.Transportation,
            chartData.Shopping,
            chartData.Entertainment,
            chartData.Misc,
          ],
          backgroundColor: [
            'rgba(91, 192, 235, 0.9)',
            'rgba(253, 231, 76, 0.9)',
            'rgba(155, 197, 61, 0.9)',
            'rgba(229, 89, 52, 0.9)',
            'rgba(250, 121, 33, 0.9)',
          ],
          borderColor: [
            'rgba(91, 192, 235, 1)',
            'rgba(253, 231, 76,1)',
            'rgba(155, 197, 61,1)',
            'rgba(229, 89, 52,1)',
            'rgba(250, 121, 33,1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    type: 'bar',
    options: {
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              min: 0,
            },
          },
        ],
      },
      maintainAspectRatio: false,
    },
  });
}

function readChart() {
  // console.log(user);
  // user = firebase.auth().currentUser;
  // console.log(user);
  const accountRef = database.ref(`users/${user.uid}/data`);
  const infoRef = document.querySelector('#data-chart-info');

  accountRef.once('value').then((snapshot) => {
    const data = snapshot.val();
    // console.log(data);
    if (data === null) {
      infoRef.innerHTML = `
        <h1>Hello!</h1>
        <hr>
        <a href="./create.html">
          <button type="button" class="btn btn-primary">Add new Expense</button>
        </a>
        `;
    } else {
      loadChart(data);
    }
    $('#loading').hide();
  });
}

function readAccountData() {
  let str = `
    <thead>
      <tr>
        <th class="col-md-1"></th>
        <th class="col-md-2">Title</th>
        <th class="col-md-2">Type</th>
        <th class="col-md-2">Number</th>
        <th class="col-md-2">Time</th>
        <th class="col-md-2">Edit</th>
        <th class="col-md-1"></th>
      </tr>
    </thead>
    `;
  // user = firebase.auth().currentUser;
  const accountRef = database.ref(`users/${user.uid}/data`);
  const infoRef = document.querySelector('#data-chart-info');
  const dataTableRef = document.querySelector('#data-table');

  accountRef.once('value').then((snapshot) => {
    const data = snapshot.val();
    if (data === null) {
      infoRef.innerHTML = `
      <h1>Hello!</h1>
      <hr>
      <a href="./create.html">
        <button type="button" class="btn btn-primary">Add new Expense</button>
      </a>
      `;
      // infoRef.innerHTML = '<h4>Have no data</h4>';
    } else {
      const arrs = [];
      let i = 0;
      Object.keys(data).forEach((key) => {
        arrs[i] = [];
        arrs[i].push(data[key].date);
        arrs[i].push(data[key].title);
        arrs[i].push(data[key].type);
        arrs[i].push(data[key].number);
        arrs[i].push(key);
        i += 1;
      });

      arrs.sort((a, b) => {
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
      });

      arrs.forEach((key) => {
        // console.log(key);
        str += `
          <tr>
            <td></td>
            <td>${key[1]}</td>
            <td>${key[2]}</td>
            <td>$ ${key[3]}</td>
            <td>${key[0]}</td>
            <td>
              <button type="button" class="btn btn-primary update-btn" data-id="${key[4]}">Update</button>
              <button type="button" class="btn btn-danger delete-btn" data-id="${key[4]}">Delete</button>
            </td>
            <td></td>
          </tr>
          `;
      });
      dataTableRef.innerHTML = str;
      // loadChart(data);
      updateBtnListener();
      deleteBtnListener();
    }
    $('#loading').hide();
  });
}

function readFormData() {
  const params = window.location.search.replace('?', '').split('&');
  const addFormRef = document.querySelector('#add-form');
  addFormRef.title.value = decodeURI(params[1].split('=')[1]);
  [, addFormRef.type.value] = params[2].split('=');
  [, addFormRef.cash.value] = params[3].split('=');
  [, addFormRef.date.value] = params[4].split('=');
  $(`#${addFormRef.type.value}`).addClass('btn-primary');
}

// Date.prototype.toDateInputValue = (() => {
//     const local = new Date(this);
//     local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
//     return local.toJSON().slice(0, 10);
// });

function submitListener(submitType) {
  const addFormRef = document.querySelector('#add-form');

  const setClass = (value) => {
    $('#Food').removeClass('btn-primary');
    $('#Transportation').removeClass('btn-primary');
    $('#Shopping').removeClass('btn-primary');
    $('#Entertainment').removeClass('btn-primary');
    $('#Misc').removeClass('btn-primary');
    $('#Income').removeClass('btn-primary');
    $(`#${value}`).addClass('btn-primary');
  };

  $('#Food').click(() => {
    addFormRef.type.value = 'Food';
    setClass(addFormRef.type.value);
  });

  $('#Transportation').click(() => {
    addFormRef.type.value = 'Transportation';
    setClass(addFormRef.type.value);
  });
  $('#Shopping').click(() => {
    addFormRef.type.value = 'Shopping';
    setClass(addFormRef.type.value);
  });
  $('#Entertainment').click(() => {
    addFormRef.type.value = 'Entertainment';
    setClass(addFormRef.type.value);
  });
  $('#Misc').click(() => {
    addFormRef.type.value = 'Misc';
    setClass(addFormRef.type.value);
  });
  $('#Income').click(() => {
    addFormRef.type.value = 'Income';
    setClass(addFormRef.type.value);
  });

  // default
  if (submitType === 'create') {
    addFormRef.type.value = 'Food';
    setClass(addFormRef.type.value);
    document.getElementById('date').valueAsDate = new Date();
  }

  addFormRef.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = addFormRef.title.value;
    const type = addFormRef.type.value;
    const number = parseFloat(addFormRef.cash.value);
    const date = addFormRef.date.value;
    if (submitType === 'create') {
      const id = uuidv4(); // random
      writeAccountData(id, title, type, number, date);
    } else {
      const params = window.location.search.replace('?', '').split('&');
      const [, id] = params[0].split('=');
      updateData(id, title, type, number, date);
    }
  });
}

const path = window.location.pathname;
// console.log(path);
switch (path) {
  case '/create.html':
    submitListener('create');
    signOutListener();
    onAuthState();
    // console.log(user);
    break;
  case '/update.html':
    readFormData();
    submitListener('update');
    signOutListener();
    onAuthState();
    // console.log(user);
    // onAuthState(readFormData);
    break;
  case '/detail.html':
    onAuthState(readAccountData);
    // readAccountData();
    signOutListener();
    // $(document).ready(function(){
    //   $('.bxslider').bxSlider();
    // });
    // console.log(user);
    break;
  case '/signin.html':
    signin();
    signOutListener();
    // console.log(user);
    break;
  default:
    onAuthState(readChart);
    // readChart();
    signOutListener();
  // onAuthState();
  // console.log(user);
}
