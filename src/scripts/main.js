import uuid from 'uuid';
import Chart from 'chart.js';
import * as firebase from 'firebase';
// var jQuery = require('jquery');
// var Bootstrap = require('bootstrap');

const config = {
    apiKey: 'AIzaSyA5p1Hl_sxOPsvcsSJQ9Ja5POe6HtyudOk',
    authDomain: 'test-d75f6.firebaseapp.com',
    databaseURL: 'https://test-d75f6.firebaseio.com',
    storageBucket: 'test-d75f6.appspot.com',
    messagingSenderId: '389657327548',
};

firebase.initializeApp(config);
const database = firebase.database();

// var provider = new firebase.auth.GoogleAuthProvider();
// firebase.auth().signInWithPopup(provider).then(function(result) {
//   var token         = result.credential.accessToken;
//   var user          = result.user;      // 使用者資訊
// }).catch(function(error) {
//   // 處理錯誤
//   var errorCode     = error.code;
//   var errorMessage  = error.message;
//   var email         = error.email;      // 使用者所使用的 Email
//   var credential    = error.credential;
// });

function writeAccountData(id, title, type, number, date) {
    const accountRef = database.ref(`skyran/${id}`);
    accountRef.set({
        title,
        type,
        number,
        date,
    });
    accountRef.on('value', () => {
        window.location = './index.html';
    });
}

function updateBtnListener() {
    const updateBtns = document.querySelectorAll('.update-btn');
    for (let i = 0; i < updateBtns.length; i += 1) {
        updateBtns[i].addEventListener('click', (e) => {
            const id = updateBtns[i].getAttribute('data-id');
            e.preventDefault();
            const accountRef = database.ref(`skyran/${id}`);
            accountRef.on('value', (snapshot) => {
                // window.location = '/update.html?id=' + id +
                // '&title=' + snapshot.val().title + '&type=' + snapshot.val().type +
                // '&number=' + snapshot.val().number + '&date=' + snapshot.val().date;
                window.location = `/update.html?id=${id}&title=${snapshot.val().title}&type=${snapshot.val().type}&number=${snapshot.val().number}&date=${snapshot.val().date}`;
            });
        });
    }
}

function deleteData(id) {
    const accountRef = database.ref(`skyran/${id}`);
    accountRef.remove();
    accountRef.on('value', () => {
        // let str =
        //             `
        //     <div class="alert alert-warning alert-dismissible" role="alert">
        //         <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        // <span aria-hidden="true">&times;</span></button>
        //         <strong>Warning!</strong> Better check yourself, you're not looking too good.
        //     </div>
        // `;
        // document.querySelector('#messenge').innerHTML = str;
        window.location = './index.html';
    });
}

function deleteBtnListener() {
    const deleteBtns = document.querySelectorAll('.delete-btn');
    for (let i = 0; i < deleteBtns.length; i += 1) {
        deleteBtns[i].addEventListener('click', (e) => {
            const id = deleteBtns[i].getAttribute('data-id');
            e.preventDefault();
            // if (confirm('確認刪除？')) {
            //     deleteData(id);
            // } else {
            //     alert('你按下取消');
            // }
            deleteData(id);
        });
    }
}

function loadChart(rawData) {
    let Meal = 0;
    let Life = 0;
    let Entertainment = 0;
    let Traffic = 0;
    let Others = 0;
    let Expense = 0;
    let Income = 0;
    const ctxDataChart = document.querySelector('#data-chart');
    const ctxDataIncomeChart = document.querySelector('#data-income-chart');

    function plusExpense(number) {
        // body...
        Expense += parseInt(number, 10);
    }

    Object.keys(rawData).forEach((key) => {
        const type = rawData[key].type;
        const number = rawData[key].number;
        // total += parseInt(number);
        switch (type) {
        case 'Meal':
            Meal += parseInt(number, 10);
            plusExpense(number);
            break;
        case 'Life':
            Life += parseInt(number, 10);
            plusExpense(number);
            break;
        case 'Entertainment':
            Entertainment += parseInt(number, 10);
            plusExpense(number);
            break;
        case 'Traffic':
            Traffic += parseInt(number, 10);
            plusExpense(number);
            break;
        case 'Others':
            Others += parseInt(number, 10);
            plusExpense(number);
            break;
        default:
            Income += parseInt(number, 10);
            break;
        }
    });

    const incomeData = {
        labels: [
            'Income',
            'Expense',
        ],
        datasets: [{
            data: [Income, Expense],
            backgroundColor: [
                '#36A2EB',
                '#FF6384',
            ],
        }],
    };

    new Chart(ctxDataIncomeChart, {
        data: incomeData,
        type: 'doughnut',
    });

    const data = {
        labels: [
            'Meal',
            'Life',
            'Entertainment',
            'Traffic',
            'Others',
        ],
        datasets: [{
            label: '',
            data: [Meal, Life, Entertainment, Traffic, Others],
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
        }],
    };

    const options = {
        legend: {
            display: false,
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display: false,
                },
            }],
            yAxes: [{
                ticks: {
                    min: 0,
                },
            }],
        },
    };

    new Chart(ctxDataChart, {
        data,
        type: 'bar',
        options,
    });
}

function readChart() {
    const accountRef = database.ref('skyran/');
    const infoRef = document.querySelector('#data-chart-info');

    accountRef.once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data === null) {
            infoRef.innerHTML = '<h4>Have no data</h4>';
        } else {
            loadChart(data);
        }
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
    const accountRef = database.ref('skyran/');
    const infoRef = document.querySelector('#data-chart-info');
    const dataTableRef = document.querySelector('#data-table');

    accountRef.once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data === null) {
            dataTableRef.innerHTML = '<h4>Creat New Expense</h4>';
            infoRef.innerHTML = '<h4>Have no data</h4>';
        } else {
            loadChart(data);

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
                str +=
                    `
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
            document.querySelector('#data-table').innerHTML = str;
            updateBtnListener();
            deleteBtnListener();
        }
    });
}

function readFormData() {
    const params = window.location.search.replace('?', '').split('&');
    const addFormRef = document.querySelector('#add-form');
    addFormRef.title.value = decodeURI(params[1].split('=')[1]);
    addFormRef.type.value = params[2].split('=')[1];
    addFormRef.number.value = params[3].split('=')[1];
    addFormRef.date.value = params[4].split('=')[1];
}

function updateData(id, title, type, number, date) {
    const accountRef = database.ref(`skyran/${id}`);
    accountRef.update({
        title,
        type,
        number,
        date,
    });
    accountRef.on('value', () => {
        window.location = './read.html';
    });
}

function submitListener(submitType) {
    const addFormRef = document.querySelector('#add-form');
    addFormRef.addEventListener('submit', (e) => {
        e.preventDefault();
        let id = uuid.v4(); // random
        const title = addFormRef.title.value;
        const type = addFormRef.type.value;
        const number = addFormRef.number.value;
        const date = addFormRef.date.value;
        if (submitType === 'create') {
            writeAccountData(id, title, type, number, date);
        } else {
            const params = window.location.search.replace('?', '').split('&');
            id = params[0].split('=')[1];
            updateData(id, title, type, number, date);
        }
    });
}

const path = window.location.pathname;
// console.log(path);
switch (path) {
case '/create.html':
    submitListener('create');
    break;
case '/update.html':
    readFormData();
    submitListener('update');
    break;
case '/read.html':
    readAccountData();
    break;
default:
    readChart();
}
