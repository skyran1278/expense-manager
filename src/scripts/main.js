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

const signup = () => {
    // let signUpUser;
    const firstUser = document.getElementById('first-user');
    const firstPassword = document.getElementById('first-password');
    const signupRef = document.getElementById('signup-btn');

    signupRef.addEventListener('click', () => {
        // console.log(firstUser.value);
        firebase.auth().createUserWithEmailAndPassword(firstUser.value, firstPassword.value)
            // .then(() => {
            //     // 登入成功後，取得登入使用者資訊
            //     signUpUser = firebase.auth().currentUser;
            //     console.log(`登入使用者為${signUpUser}`);
            //     database.ref(`users/${signUpUser.uid}`).set({
            //         email: signUpUser.email,
            //     })
            //     .catch((error) => {
            //         console.error('寫入使用者資訊錯誤', error);
            //     });
            // })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                console.log(error);
            });
    });
};

let loginUser;

const onAuthState = (callback) => {
    firebase.auth().onAuthStateChanged((auth) => {
        if (auth) {
            loginUser = auth;
            // console.log('User is logined', auth);
            console.log(callback);
            if (callback !== undefined) {
                callback();
            }
        } else {
            loginUser = null;
            console.log('User is not logined yet.');
        }
    });
};


const login = () => {
    const user = document.getElementById('user');
    const password = document.getElementById('password');
    const loginRef = document.getElementById('login-btn');

    loginRef.addEventListener('click', () => {
        // console.log(firstUser.value);
        firebase.auth()
            .signInWithEmailAndPassword(user.value, password.value)
            // .then(() => {
            //     // 登入成功後，取得登入使用者資訊
            //     signUpUser = firebase.auth().currentUser;
            //     console.log(`登入使用者為${signUpUser}`);
            //     database.ref(`users/${signUpUser.uid}`).set({
            //         email: signUpUser.email,
            //     })
            //     .catch((error) => {
            //         console.error('寫入使用者資訊錯誤', error);
            //     });
            // })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                console.log(error);
            });
        window.location = './index.html';
    });

    // var signoutSmtBtn = document.getElementById("signoutSmtBtn");
    // signoutSmtBtn.addEventListener("click",function(){
    //     firebase.auth().signOut().then(function() {
    //         console.log("User sign out!");
    //     }, function(error) {
    //     console.log("User sign out error!");
    //     })
    // },false);
};

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
    const accountRef = database.ref(`users/${loginUser.uid}/${id}`);
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
            const accountRef = database.ref(`users/${loginUser.uid}/${id}`);
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
    const accountRef = database.ref(`users/${loginUser.uid}/${id}`);
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
    // console.log(loginUser);
    const accountRef = database.ref(`users/${loginUser.uid}`);
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
    const accountRef = database.ref(`users/${loginUser.uid}`);
    // const infoRef = document.querySelector('#data-chart-info');
    const dataTableRef = document.querySelector('#data-table');

    accountRef.once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data === null) {
            dataTableRef.innerHTML = '<h4>Creat New Expense</h4>';
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
    const accountRef = database.ref(`users/${loginUser.uid}/${id}`);
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
    onAuthState();
    submitListener('create');
    break;
case '/update.html':
    onAuthState(readFormData);
    submitListener('update');
    break;
case '/detail.html':
    onAuthState(readAccountData);
    break;
case '/login.html':
    login();
    signup();
    break;
default:
    onAuthState(readChart);
}

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyASwAnakbaqQB578LGHHbPCht7I_FqjNHs",
    authDomain: "test-35b46.firebaseapp.com",
    databaseURL: "https://test-35b46.firebaseio.com",
    storageBucket: "test-35b46.appspot.com",
    messagingSenderId: "558722894017"
  };
firebase.initializeApp(config);
var database = firebase.database();

//Email/Pwd註冊
var loginUser;
var account = document.getElementById("account");
var pwd = document.getElementById("pwd");
var registerSmtBtn = document.getElementById("registerSmtBtn");
var age = document.getElementById("age");
var name = document.getElementById("name");
registerSmtBtn.addEventListener("click", function(){
        console.log(account.value);
    firebase.auth().createUserWithEmailAndPassword(account.value, pwd.value).then(function(){
        //登入成功後，取得登入使用者資訊
        loginUser = firebase.auth().currentUser;
      console.log("登入使用者為",loginUser);
      firebase.database().ref('users/' + loginUser.uid).set({
        email: loginUser.email,
        name: name.value,
        age : age.value
      }).catch(function(error){
        console.error("寫入使用者資訊錯誤",error);
      });
    }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMsg = error.message;
    console.log(errorMsg);
  });
},false);

//登入
var accountL = document.getElementById("accountL");
var pwdL = document.getElementById("pwdL");
var loginSmtBtn = document.getElementById("loginSmtBtn");
loginSmtBtn.addEventListener("click",function(){
    firebase.auth().signInWithEmailAndPassword(accountL.value, pwdL.value).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
  })
},false);

var loginUser;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    loginUser = user;
    console.log("User is logined", user)
  } else {
    loginUser = null;
    console.log("User is not logined yet.");
  }
});

var signoutSmtBtn = document.getElementById("signoutSmtBtn");
signoutSmtBtn.addEventListener("click",function(){
    firebase.auth().signOut().then(function() {
        console.log("User sign out!");
    }, function(error) {
    console.log("User sign out error!");
    })
},false);

//取得目前使用者資訊
var userInfoBtn = document.getElementById("userInfoBtn");
var userInfo = document.getElementById("userInfo");
userInfoBtn.addEventListener("click",function(){
    //資料讀取一次後就不再理會
  firebase.database().ref('/users/' + loginUser.uid).once('value').then(function(snapshot) {
    var userInfoText = "使用者姓名："+snapshot.val().name+", 使用者年齡:"+snapshot.val().age;
    console.log(userInfoText);
    userInfo.innerHTML = userInfoText;
  });
},false);

//關注使用者清單
var userRef = firebase.database().ref('users');
userRef.on('value', function(snapshot) {
  console.log("目前所有使用者：",snapshot.val());
});

//刪除使用者資料
var delUserInfoBtn = document.getElementById("delUserInfoBtn");
delUserInfoBtn.addEventListener("click", function(){
    firebase.database().ref('/users/' + loginUser.uid + "/name").remove().then(function(){
    console.log("成功刪除")
  });
}, false);

//新增Post
var postSmtBtn = document.getElementById("postSmtBtn");
var postTitle = document.getElementById("postTitle");
var postContent = document.getElementById("postContent");
var postLimitAge = document.getElementById("postLimitAge");
postSmtBtn.addEventListener("click", function(){
    var postRef = firebase.database().ref('/posts/' + loginUser.uid);
    postRef.push().set({
    uid: loginUser.uid,
    title: postTitle.value,
    content:postContent.value,
    age:parseInt(postLimitAge.value)
  }).then(function(){
    console.log("新增Post成功");
  }).catch(function(err){
    console.error("新增Post錯誤：",err);
  })
})

var postList = document.getElementById("postList");
var postListBtn = document.getElementById("postListBtn");
postListBtn.addEventListener("click", function(){
    //
  console.log(loginUser.age);
    var postsRef = firebase.database().ref('posts/' + loginUser.uid).orderByChild("age").startAt(20 + "");
  console.log("取得使用者所有Post")
  postsRef.once('value').then(function(snapshot){
    snapshot.forEach(function(childSnapshot) {
      console.log(childSnapshot.val());
    });
  })
}, false);
