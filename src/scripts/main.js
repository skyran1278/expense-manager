const chart = require('chart.js');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://b02501016-hw2:cAlI1pTPQkRRBH6qoZdmHFIlo2cXe3szdeWIXZa0O8cXxNMbhPjVVj0FcJn9STnHlzJUnLbGlubivOkV5QGxSQ==@b02501016-hw2.documents.azure.com:10250/?ssl=true';

// var insertDocument = function(title, type, number, date, db, callback) {
   
// 	db.collection('skyran').insertOne( {
//         title: title,
//         type: type,
//         number: number,
//         date: date
// 	}, 
// 	function(err, result) {
// 		assert.equal(err, null);
// 		console.log("Inserted a document into the skyran collection.");
// 		callback();
// 	});

// };

// var findDocument = function(db, callback) {
//    var cursor =db.collection('skyran').find( { "borough": "Manhattan" } );
//    cursor.each(function(err, doc) {
//       assert.equal(err, null);
//       if (doc != null) {
//          console.dir(doc);
//       } else {
//          callback();
//       }
//    });
// };

// var updateDocument = function(db, callback) {
//    db.collection('skyran').updateOne(
//       { "name" : "Juni" },
//       {
//         $set: { "cuisine": "American (New)" },
//         $currentDate: { "lastModified": true }
//       }, function(err, results) {
//       console.log(results);
//       callback();
//    });
// };

// var removeDocument = function(db, callback) {
//    db.collection('skyran').deleteOne(
//       { "borough": "Queens" },
//       function(err, results) {
//          console.log(results);
//          callback();
//       }
//    );
// };

// function submitListener(submitType) {
//     const addFormRef = document.querySelector("#add-form");
//     addFormRef.addEventListener('submit', function(e) {
//         e.preventDefault();        
//         const title = addFormRef.title.value;
//         const type = addFormRef.type.value;
//         const number = addFormRef.number.value;
//         const date = addFormRef.date.value;
//         if (submitType === 'create') {
//             insertDocument(title, type, number, date,  db, function() {
// 				db.close();
// 				window.location = './';
// 			});
//         } else {
//             const params = window.location.search.replace('?', '').split('&');
//             const id = params[0].split('=')[1];
//             updateData(id, title, type, number, date);
//         }
//     });
// }

// MongoClient.connect(url, function(err, db) {
// 	assert.equal(null, err);
// 	// insertDocument('id', 'title', 'type', 'number', 'date', db, function() {
// 	// 	db.close();
// 	// 	window.location = './';
// 	// });
// 	function submitListener(submitType) {
// 	    const addFormRef = document.querySelector("#add-form");
// 	    addFormRef.addEventListener('submit', function(e) {
// 	        e.preventDefault();        
// 	        const title = addFormRef.title.value;
// 	        const type = addFormRef.type.value;
// 	        const number = addFormRef.number.value;
// 	        const date = addFormRef.date.value;
// 	        insertDocument(title, type, number, date,  db, function() {
// 					db.close();
// 					window.location = './';
// 			});
// 	   //      if (submitType === 'create') {
// 	   //          insertDocument(title, type, number, date,  db, function() {
// 				// 	db.close();
// 				// 	window.location = './';
// 				// });
// 	   //      } else {
// 	   //          const params = window.location.search.replace('?', '').split('&');
// 	   //          const id = params[0].split('=')[1];
// 	   //          updateData(id, title, type, number, date);
// 	   //      }
// 	    });
// 	}
// 	// findDocument(db, function() {
//  //      db.close();
//  //  	});
// 	// updateDocument(db, function() {
//  //      db.close();
//  //  	});
// 	// removeDocument(db, function() {
//  //      db.close();
//  //  	});

// });

MongoClient.connect(url, function(err, db) {
    console.log('主機連線成功');

    var data1 = {
        "type": "晚餐",
        "cost": 300,
        //"date": new Date(2017, 03, 22, 15, 17),
        "update": Date.now()
    };

    // 插入資料
    db.collection('skyran').insertOne(data1, function(err, result) {
        console.log("插入資料成功");
    });

    // function submitListener(submitType) {
    //     const addFormRef = document.querySelector("#add-form");
    //     addFormRef.addEventListener('submit', function(e) {
    //         e.preventDefault();        
    //         const title = addFormRef.title.value;
    //         const type = addFormRef.type.value;
    //         const number = addFormRef.number.value;
    //         const date = addFormRef.date.value;
    //         insertDocument(title, type, number, date,  db, function() {
    //             console.log("插入資料成功");
    //             window.location = './';
    //         });
    //     });
    // }

    

    db.close();
});