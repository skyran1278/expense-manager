import uuid from 'uuid';
import Chart from 'chart.js'

var config = {
    apiKey: "AIzaSyA5p1Hl_sxOPsvcsSJQ9Ja5POe6HtyudOk",
    authDomain: "test-d75f6.firebaseapp.com",
    databaseURL: "https://test-d75f6.firebaseio.com",
    storageBucket: "test-d75f6.appspot.com",
    messagingSenderId: "389657327548"
  };

firebase.initializeApp(config);
const database = firebase.database();

function writeAccountData(id, title, type, number, date) {
    const accountRef = database.ref('skyran/' + id);
    accountRef.set({
        title: title,
        type: type,
        number: number,
        date: date
    });
    accountRef.on('value', function(snapshot) {
        console.log('success');
        window.location = './index.html';
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

    accountRef.once('value').then(function(snapshot) {
        const data = snapshot.val();
        console.log(data);
        if (data === null) {
            // str += '<h4>目前沒有資料喔！</h4>';
            dataTableRef.innerHTML = '<h4>Creat New Expense</h4>';
            infoRef.innerHTML = '<h4>Have no data</h4>';
        } else {
            loadChart(data);
            Object.keys(data).forEach(function(key, index) {
                str +=
                    `
          <tr>
            <td></td>
            <td>${data[key].title}</td>
            <td>${data[key].type}</td>
            <td>NT ${data[key].number}</td>
            <td>${data[key].date}</td>
            <td>  
              <button type="button" class="btn btn-primary update-btn" data-id="${key}">編輯</button>
              <button type="button" class="btn btn-danger delete-btn" data-id="${key}">刪除</button>
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
    console.log(params);
    const addFormRef = document.querySelector("#add-form");
    addFormRef.title.value = decodeURI(params[1].split('=')[1]);
    addFormRef.type.value = params[2].split('=')[1];
    addFormRef.number.value = params[3].split('=')[1];
    addFormRef.date.value = params[4].split('=')[1];
}

function updateData(id, title, type, number, date) {
    const accountRef = database.ref('skyran/' + id);
    accountRef.update({
        title: title,
        type: type,
        number: number,
        date: date
    });
    accountRef.on('value', function(snapshot) {
        console.log('success');
        window.location = './index.html';
    });
}

function deleteData(id) {
    const accountRef = database.ref('skyran/' + id);
    accountRef.remove();
    accountRef.on('value', function(snapshot) {
        console.log('success');
        window.location = './index.html';
    });
}

function submitListener(submitType) {
    const addFormRef = document.querySelector("#add-form");
    addFormRef.addEventListener('submit', function(e) {
        e.preventDefault();
        const id = uuid.v4(); //random
        const title = addFormRef.title.value;
        const type = addFormRef.type.value;
        const number = addFormRef.number.value;
        const date = addFormRef.date.value;
        if (submitType === 'create') {
            writeAccountData(id, title, type, number, date);
        } else {
            const params = window.location.search.replace('?', '').split('&');
            const id = params[0].split('=')[1];
            updateData(id, title, type, number, date);
        }
    });
}

function updateBtnListener() {
    const updateBtns = document.querySelectorAll(".update-btn");
    console.log(updateBtns);
    for (let i = 0; i < updateBtns.length; i++) {
        updateBtns[i].addEventListener('click', function(e) {
            const id = updateBtns[i].getAttribute('data-id');
            e.preventDefault();
            const accountRef = database.ref('skyran/' + id);
            accountRef.on('value', function(snapshot) {
                window.location = '/update.html?id=' + id + '&title=' + snapshot.val().title + '&type=' + snapshot.val().type + '&number=' + snapshot.val().number + '&date=' + snapshot.val().date;
            });
        });
    }
}

function deleteBtnListener() {
    const deleteBtns = document.querySelectorAll(".delete-btn");
    console.log(deleteBtns);
    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener('click', function(e) {
            const id = deleteBtns[i].getAttribute('data-id');
            e.preventDefault();
            deleteData(id);            
        });
    }
}

function loadChart(rawData) {
    let Meal = 0;
    let Life = 0;
    let Entertainment = 0;
    let edu = 0;
    let Traffic = 0;
    let Others = 0;
    const ctxRef = document.querySelector('#data-chart');
    const infoRef = document.querySelector('#data-chart-info');
    for(const key in rawData) {
      if (rawData.hasOwnProperty(key)) {
        const type = rawData[key].type;
        const number = rawData[key].number;
        switch(type) {
          case 'Meal':
            Meal += parseInt(number);
            break;
          case 'Life':
            Life += parseInt(number);
            break;
          case 'Entertainment':
            Entertainment += parseInt(number);
            break;
          case 'edu':
            edu += parseInt(number);
            break;            
          case 'Traffic':
            Traffic += parseInt(number);
            break; 
          case 'Others':
            Others += parseInt(number);
            break; 
        }
      }
    }
    const data = {
        labels: [
            'Meal',
            'Life',
            'Entertainment',
            'Traffic',
            'Others'
        ],
        datasets: [
        {
            label: "",
            data: [Meal, Life, Entertainment, Traffic, Others],
            backgroundColor: [
                'rgba(91, 192, 235, 0.5)',
                'rgba(253, 231, 76, 0.5)',
                'rgba(155, 197, 61, 0.5)',
                'rgba(229, 89, 52, 0.5)',
                'rgba(250, 121, 33, 0.5)'                
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
    };
    const myPieChart = new Chart(ctxRef, {
        type: 'bar',
        data: data,
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
