import uuid from 'uuid';
import Chart from 'chart.js';
import * as firebase from 'firebase';
// window.$ = window.jQuery = require('dist/bower_components/jquery/dist/jquery');
// require('dist/bower_components/bootstrap/dist/js/bootstrap');
// var Bootstrap = require('bootstrap');

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
// var user = firebase.auth().currentUser;
const onAuthState = (callback) => {
    firebase.auth().onAuthStateChanged((auth) => {
        if (auth) {
            user = auth;
            // console.log('User is logined', auth);
            // console.log(callback);
            if (callback !== undefined) {
                callback();
            }
        } else {
            user = null;
            window.location = './login.html';
            // console.log('User is not logined yet.');
        }
    });
};

const signup = () => {
    // let signUpUser;
    const firstUser = document.getElementById('first-user');
    const firstPassword = document.getElementById('first-password');
    const signupRef = document.getElementById('signup-btn');
    const signupErrorMessage = document.getElementById('signup-error-message');

    signupRef.addEventListener('click', () => {
        // console.log(firstUser.value);
        firebase.auth().createUserWithEmailAndPassword(firstUser.value, firstPassword.value)
            .then(() => {
                window.location = './index.html';
            })
            .catch((error) => {
                // const errorCode = error.code;
                const errorMessage = error.message;
                signupErrorMessage.innerHTML = errorMessage;
            });
    });
};

const login = () => {
    const loginUser = document.getElementById('user');
    const password = document.getElementById('password');
    const loginRef = document.getElementById('login-btn');
    const loginGoogle = document.getElementById('login-google');
    const loginFacebook = document.getElementById('login-facebook');
    const loginErrorMessage = document.getElementById('login-error-message');

    loginRef.addEventListener('click', () => {
        // console.log(firstUser.value);
        firebase.auth()
            .signInWithEmailAndPassword(loginUser.value, password.value)
            .then(() => {
                window.location = './index.html';
            })
            .catch((error) => {
                // const errorCode = error.code;
                const errorMessage = error.message;
                loginErrorMessage.innerHTML = errorMessage;
            });
    });

    loginGoogle.addEventListener('click', () => {
        // console.log(firstUser.value);
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(() => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // const token = result.credential.accessToken;
            // The signed-in user info.
            // const user = result.user;
            // ...
            // user = result.user;
            // console.log(result.user);
            window.location = './index.html';
        }).catch((error) => {
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

    loginFacebook.addEventListener('click', () => {
        // console.log(firstUser.value);
        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider).then(() => {
            // .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // const token = result.credential.accessToken;
            // The signed-in user info.
            // const user = result.user;
            // ...
            window.location = './index.html';
        }).catch((error) => {
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
        firebase.auth().signOut().then(() => {
            // console.log('User sign out!');
        }, (error) => {
            console.log(error);
        });
    });
}

function writeAccountData(id, title, type, number, date) {
    // user = firebase.auth().currentUser;
    const accountRef = database.ref(`users/${user.uid}/${id}`);
    accountRef.set({
        title,
        type,
        number,
        date,
    });
    accountRef.on('value', () => {
        window.location = './index.html';
        // console.log(user);
    });
}

function updateBtnListener() {
    // user = firebase.auth().currentUser;
    const updateBtns = document.querySelectorAll('.update-btn');
    for (let i = 0; i < updateBtns.length; i += 1) {
        updateBtns[i].addEventListener('click', (e) => {
            const id = updateBtns[i].getAttribute('data-id');
            e.preventDefault();
            const accountRef = database.ref(`users/${user.uid}/${id}`);
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
    // user = firebase.auth().currentUser;
    const accountRef = database.ref(`users/${user.uid}/${id}`);
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
        window.location = './detail.html';
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
    // console.log(user);
    // user = firebase.auth().currentUser;
    // console.log(user);
    const accountRef = database.ref(`users/${user.uid}`);
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
    const accountRef = database.ref(`users/${user.uid}`);
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
    addFormRef.type.value = params[2].split('=')[1];
    addFormRef.number.value = params[3].split('=')[1];
    addFormRef.date.value = params[4].split('=')[1];
    $(`#${addFormRef.type.value.toLowerCase()}`).addClass('btn-primary');
}

function updateData(id, title, type, number, date) {
    // user = firebase.auth().currentUser;
    const accountRef = database.ref(`users/${user.uid}/${id}`);
    accountRef.update({
        title,
        type,
        number,
        date,
    });
    accountRef.on('value', () => {
        window.location = './detail.html';
    });
}

// Date.prototype.toDateInputValue = (() => {
//     const local = new Date(this);
//     local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
//     return local.toJSON().slice(0, 10);
// });

function submitListener(submitType) {
    const addFormRef = document.querySelector('#add-form');
    const setClass = (value) => {
        $('#meal').removeClass('btn-primary');
        $('#life').removeClass('btn-primary');
        $('#entertainment').removeClass('btn-primary');
        $('#traffic').removeClass('btn-primary');
        $('#others').removeClass('btn-primary');
        $('#income').removeClass('btn-primary');
        $(`#${value.toLowerCase()}`).addClass('btn-primary');
    };

    $('#meal').click(() => {
        addFormRef.type.value = 'Meal';
        setClass(addFormRef.type.value);
    });

    $('#life').click(() => {
        addFormRef.type.value = 'Life';
        setClass(addFormRef.type.value);
    });
    $('#entertainment').click(() => {
        addFormRef.type.value = 'Entertainment';
        setClass(addFormRef.type.value);
    });
    $('#traffic').click(() => {
        addFormRef.type.value = 'Traffic';
        setClass(addFormRef.type.value);
    });
    $('#others').click(() => {
        addFormRef.type.value = 'Others';
        setClass(addFormRef.type.value);
    });
    $('#income').click(() => {
        addFormRef.type.value = 'Income';
        setClass(addFormRef.type.value);
    });

    // addFormRef.date.value = new Date().toDateInputValue();
    document.getElementById('date').valueAsDate = new Date();

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
case '/login.html':
    login();
    signup();
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
