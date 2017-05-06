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
                'rgba(91, 192, 235, 1)',
                'rgba(155, 197, 61,1)'
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
    // const myPieChart = new Chart(ctxRef, {
    const dataChart = new Chart(ctxDataChart, {
        // Chart(ctxRef, {
        data,
        type: 'bar',
        options: {
            legend: {
                display: false
            }
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
        // console.log(data);
        if (data === null) {
            // str += '<h4>目前沒有資料喔！</h4>';
            dataTableRef.innerHTML = '<h4>Creat New Expense</h4>';
            infoRef.innerHTML = '<h4>Have no data</h4>';
        } else {
            loadChart(data);
            Object.keys(data).forEach((key) => {
                str +=
                    `
          <tr>
            <td></td>
            <td>${data[key].title}</td>
            <td>${data[key].type}</td>
            <td>$ ${data[key].number}</td>
            <td>${data[key].date}</td>
            <td>
              <button type="button" class="btn btn-primary update-btn" data-id="${key}">Update</button>
              <button type="button" class="btn btn-danger delete-btn" data-id="${key}">Delete</button>
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
        window.location = './index.html';
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

switch (path) {
    case '/create.html':
        submitListener('create');
        break;
    case '/update.html':
        readFormData();
        submitListener('update');
        break;
    default:
        readAccountData();
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
