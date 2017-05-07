import uuid from 'uuid';
import Chart from 'chart.js';

const config = {
    apiKey: 'AIzaSyA5p1Hl_sxOPsvcsSJQ9Ja5POe6HtyudOk',
    authDomain: 'test-d75f6.firebaseapp.com',
    databaseURL: 'https://test-d75f6.firebaseio.com',
    storageBucket: 'test-d75f6.appspot.com',
    messagingSenderId: '389657327548'
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
(function () {
    // body...
    const str = `
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="./index.html">
                    <img alt="Brand" src="./img/icon_48.png" onError="this.onerror=null;this.src='./img/icon700.svg;">
                </a>
                <a class="navbar-brand" href="./index.html">Expense Manager</a>
            </div>
            <div id="navbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav navbar-right">
                    <li><a href="./index.html">Home</a></li>
                    <li><a href="./read.html">Detailed</a></li>
                    <li><a href="./create.html">Create</a></li>
                    <!-- <li><a href="#">Sign in</a></li> -->
                </ul>
            </div>
        </div>
    `;
    $('#nav').html(str);
    // console.log(str);
    // document.querySelector('#nav').innerHTML = str;
}());

function productForm() {
    // body...
    const str = `
    <div class="form-group">
        <label for="number">How much did you spend?</label>
        <input type="number" class="form-control" name="number" id="number" placeholder="Amount of Consumption" required>
    </div>
    <div class="form-group">
        <label for="type">Consumption Type</label>
        <!-- <br>
        <input class="btn btn-primary" name="type" id="type" type="button" value="Meal">
        <input class="btn btn-info" name="type" id="type" type="button" value="Life">
        <input class="btn btn-success" name="type" id="type" type="button" value="Entertainment">
        <input class="btn btn-warning" name="type" id="type" type="button" value="Traffic">
        <input class="btn btn-danger" name="type" id="type" type="button" value="Others"> -->
        <!-- <br>
        <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-default ">Meal</button>
            <button type="button" class="btn btn-default ">Life</button>
            <button type="button" class="btn btn-default ">Entertainment</button>
            <button type="button" class="btn btn-default ">Traffic</button>
            <button type="button" class="btn btn-default ">Others</button>
        </div> -->
        <select class="form-control" name="type" id="type" required>
            <option value="">Select</option>
            <option value="Meal">Meal</option>
            <option value="Life">Life</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Traffic">Traffic</option>
            <option value="Others">Others</option>
            <option value="Income">Income</option>
        </select>
    </div>

    <div class="form-group">
        <label for="date">When did you spend?</label>
        <input type="date" class="form-control" name="date" id="date" placeholder="2016/10/10" required>
    </div>
    <div class="form-group">
        <label for="title">What did you buy?</label>
        <input type="text" class="form-control" name="title" id="title" placeholder="Please enter the name of the consumer, Ex. Lunch, dinner, watch the movie" required>
    </div>
    <button type="submit" class="btn btn-success">Submit</button>
    <a href="./index.html">
        <button type="button" class="btn btn-default">Home</button>
    </a>
    `;
    $('#add-form').html(str);
}

function writeAccountData(id, title, type, number, date) {
    const accountRef = database.ref(`skyran/${id}`);
    accountRef.set({
        title,
        type,
        number,
        date
    });
    accountRef.on('value', () => {
        // console.log('success');
        window.location = './index.html';
    });
}

function updateBtnListener() {
    const updateBtns = document.querySelectorAll('.update-btn');
    // console.log(updateBtns);
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
        // console.log('success');
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
    // console.log(deleteBtns);
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
    // let total = 0;
    const ctxDataChart = document.querySelector('#data-chart');
    const ctxDataIncomeChart = document.querySelector('#data-income-chart');
    // const infoRef = document.querySelector('#data-chart-info');
    // const totalRef = document.querySelector('#total-number');
    // console.log(rawData);
    // console.log(Object.keys(rawData));
    // console.log(Object.keys(rawData).forEach((key) => {
    //     console.log(rawData[key]);
    //     console.log(key);
    // }));

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
    // console.log(Expense);
    // console.log(Income);

    // for (const key in rawData) {
    //     if (rawData.hasOwnProperty(key)) {
    //         const type = rawData[key].type;
    //         const number = rawData[key].number;
    //         // total += parseInt(number);
    //         switch (type) {
    //             case 'Meal':
    //                 Meal += parseInt(number);
    //                 break;
    //             case 'Life':
    //                 Life += parseInt(number);
    //                 break;
    //             case 'Entertainment':
    //                 Entertainment += parseInt(number);
    //                 break;
    //             case 'edu':
    //                 edu += parseInt(number);
    //                 break;

    //             case 'Traffic':
    //                 Traffic += parseInt(number);
    //                 break;

    //             case 'Others':
    //                 Others += parseInt(number);
    //                 break;
    //         }
    //     }
    // }
    // totalRef.innerHTML = `$ ${total}`;

    const incomeData = {
        labels: [
            'Income',
            'Expense'
        ],
        datasets: [{
            // label: '',
            data: [Income, Expense],
            backgroundColor: [
                '#36A2EB',
                '#FF6384'
            ]
            // borderColor: [
            //     'rgba(102, 153, 204, 1)',
            //     'rgba(250, 121, 33,1)'
            // ],
            // borderWidth: 1
        }]
    };

    const DataIncomeChart = new Chart(ctxDataIncomeChart, {
        // Chart(ctxRef, {
        data: incomeData,
        type: 'doughnut'
        // options: {
        //     legend: {
        //         display: false
        //     }
        // }
    });

    const data = {
        labels: [
            'Meal',
            'Life',
            'Entertainment',
            'Traffic',
            'Others'
        ],
        datasets: [{
                label: '',
                data: [Meal, Life, Entertainment, Traffic, Others],
                backgroundColor: [
                    'rgba(91, 192, 235, 0.9)',
                    'rgba(253, 231, 76, 0.9)',
                    'rgba(155, 197, 61, 0.9)',
                    'rgba(229, 89, 52, 0.9)',
                    'rgba(250, 121, 33, 0.9)'
                ],
                borderColor: [
                    'rgba(91, 192, 235, 1)',
                    'rgba(253, 231, 76,1)',
                    'rgba(155, 197, 61,1)',
                    'rgba(229, 89, 52,1)',
                    'rgba(250, 121, 33,1)'
                ],
                borderWidth: 1
            }]
            // options: {
            //     legend: {
            //         display: false,
            //     },
            //     scales: {
            //         xAxes: [{
            //             stacked: true
            //         }],
            //         yAxes: [{
            //             stacked: true
            //         }]
            //     }
            // }
    };
    // const axes = [{
    //     gridLines: {
    //         display: false
    //     },
    //     ticks: {
    //         min: 0,
    //         // max: 1000
    //     }
    // }];
    const options = {
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                ticks: {
                    min: 0
                    // max: 1000
                }
            }]
        }
    };
    // const myPieChart = new Chart(ctxRef, {
    const dataChart = new Chart(ctxDataChart, {
        // Chart(ctxRef, {
        data,
        type: 'bar',
        options
    });
    // console.log("hey");
}

function readChart() {
    // body...
    const accountRef = database.ref('skyran/');
    const infoRef = document.querySelector('#data-chart-info');
    // const dataTableRef = document.querySelector('#data-table');

    accountRef.once('value').then((snapshot) => {
        const data = snapshot.val();
        // console.log(data);
        if (data === null) {
            // str += '<h4>目前沒有資料喔！</h4>';
            // dataTableRef.innerHTML = '<h4>Creat New Expense</h4>';
            infoRef.innerHTML = '<h4>Have no data</h4>';
        } else {
            loadChart(data);
            }
        });
    console.log("readChart");
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
        // console.log(data);
        if (data === null) {
            // str += '<h4>目前沒有資料喔！</h4>';
            dataTableRef.innerHTML = '<h4>Creat New Expense</h4>';
            infoRef.innerHTML = '<h4>Have no data</h4>';
        } else {
            loadChart(data);

            // console.log("hi");
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


                // console.log(data[key]);
            //     // str +=
            //     //     `
            //     // <tr>
            //     //     <td></td>
            //     //     <td>${data[key].title}</td>
            //     //     <td>${data[key].type}</td>
            //     //     <td>$ ${data[key].number}</td>
            //     //     <td>${data[key].date}</td>
            //     //     <td>
            //     //         <button type="button" class="btn btn-primary update-btn" data-id="${key}">Update</button>
            //     //         <button type="button" class="btn btn-danger delete-btn" data-id="${key}">Delete</button>
            //     //     </td>
            //     //     <td></td>
            //     // </tr>
            //     // `;
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
            // console.log(arrs);
            document.querySelector('#data-table').innerHTML = str;
            updateBtnListener();
            deleteBtnListener();
        }
    });
}

function readFormData() {
    const params = window.location.search.replace('?', '').split('&');
    // console.log(params);
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
        date
    });
    accountRef.on('value', () => {
        // console.log('success');
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
console.log(path);
switch (path) {
    case '/create.html':
        productForm();
        submitListener('create');
        break;
    case '/update.html':
        productForm();
        readFormData();
        submitListener('update');
        break;
    case '/read.html':
        readAccountData();
        break;
    default:
        readChart();
}


// -----------------------------------------

// const chart = require('chart.js');
// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');
// const ObjectId = require('mongodb').ObjectID;
// const url = 'mongodb://b02501016-hw2:cAlI1pTPQkRRBH6qoZdmHFIlo2cXe3szdeWIXZa0O8cXxNMbhPjVVj0FcJn9STnHlzJUnLbGlubivOkV5QGxSQ==@b02501016-hw2.documents.azure.com:10250/?ssl=true';

// // var insertDocument = function(title, type, number, date, db, callback) {

// //  db.collection('skyran').insertOne( {
// //         title: title,
// //         type: type,
// //         number: number,
// //         date: date
// //  },
// //  function(err, result) {
// //      assert.equal(err, null);
// //      console.log("Inserted a document into the skyran collection.");
// //      callback();
// //  });

// // };

// // var findDocument = function(db, callback) {
// //    var cursor =db.collection('skyran').find( { "borough": "Manhattan" } );
// //    cursor.each(function(err, doc) {
// //       assert.equal(err, null);
// //       if (doc != null) {
// //          console.dir(doc);
// //       } else {
// //          callback();
// //       }
// //    });
// // };

// // var updateDocument = function(db, callback) {
// //    db.collection('skyran').updateOne(
// //       { "name" : "Juni" },
// //       {
// //         $set: { "cuisine": "American (New)" },
// //         $currentDate: { "lastModified": true }
// //       }, function(err, results) {
// //       console.log(results);
// //       callback();
// //    });
// // };

// // var removeDocument = function(db, callback) {
// //    db.collection('skyran').deleteOne(
// //       { "borough": "Queens" },
// //       function(err, results) {
// //          console.log(results);
// //          callback();
// //       }
// //    );
// // };

// // function submitListener(submitType) {
// //     const addFormRef = document.querySelector("#add-form");
// //     addFormRef.addEventListener('submit', function(e) {
// //         e.preventDefault();
// //         const title = addFormRef.title.value;
// //         const type = addFormRef.type.value;
// //         const number = addFormRef.number.value;
// //         const date = addFormRef.date.value;
// //         if (submitType === 'create') {
// //             insertDocument(title, type, number, date,  db, function() {
// //              db.close();
// //              window.location = './';
// //          });
// //         } else {
// //             const params = window.location.search.replace('?', '').split('&');
// //             const id = params[0].split('=')[1];
// //             updateData(id, title, type, number, date);
// //         }
// //     });
// // }

// // MongoClient.connect(url, function(err, db) {
// //  assert.equal(null, err);
// //  // insertDocument('id', 'title', 'type', 'number', 'date', db, function() {
// //  //  db.close();
// //  //  window.location = './';
// //  // });
// //  function submitListener(submitType) {
// //      const addFormRef = document.querySelector("#add-form");
// //      addFormRef.addEventListener('submit', function(e) {
// //          e.preventDefault();
// //          const title = addFormRef.title.value;
// //          const type = addFormRef.type.value;
// //          const number = addFormRef.number.value;
// //          const date = addFormRef.date.value;
// //          insertDocument(title, type, number, date,  db, function() {
// //                  db.close();
// //                  window.location = './';
// //          });
// //     //      if (submitType === 'create') {
// //     //          insertDocument(title, type, number, date,  db, function() {
// //              //  db.close();
// //              //  window.location = './';
// //              // });
// //     //      } else {
// //     //          const params = window.location.search.replace('?', '').split('&');
// //     //          const id = params[0].split('=')[1];
// //     //          updateData(id, title, type, number, date);
// //     //      }
// //      });
// //  }
// //  // findDocument(db, function() {
// //  //      db.close();
// //  //      });
// //  // updateDocument(db, function() {
// //  //      db.close();
// //  //      });
// //  // removeDocument(db, function() {
// //  //      db.close();
// //  //      });

// // });

// MongoClient.connect(url, function(err, db) {
//     console.log('主機連線成功');

//     var data1 = {
//         "type": "晚餐",
//         "cost": 300,
//         //"date": new Date(2017, 03, 22, 15, 17),
//         "update": Date.now()
//     };

//     // 插入資料
//     db.collection('skyran').insertOne(data1, function(err, result) {
//         console.log("插入資料成功");
//     });

//     // function submitListener(submitType) {
//     //     const addFormRef = document.querySelector("#add-form");
//     //     addFormRef.addEventListener('submit', function(e) {
//     //         e.preventDefault();
//     //         const title = addFormRef.title.value;
//     //         const type = addFormRef.type.value;
//     //         const number = addFormRef.number.value;
//     //         const date = addFormRef.date.value;
//     //         insertDocument(title, type, number, date,  db, function() {
//     //             console.log("插入資料成功");
//     //             window.location = './';
//     //         });
//     //     });
//     // }


//     db.close();
// });
