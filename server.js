var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

// /* global process */
// /* global __dirname */
// const http = require('http');
// const url = require('url');
// const path = require('path');

// // 引用 File System 模組
// const fs = require('fs');

// // const file_content;
// const webPath = 'docs';

// const server = http.createServer((req, res) => {
//     // // 解析使用者要求的路徑名稱
//     const urlPath = url.parse(req.url);
//     let pathname = urlPath.pathname;

//     // // 判斷pathname是否為預設路徑
//     if (pathname === '/' || pathname === '/index.htm') {
//         pathname = 'index.html';
//     }

//     // // __dirname 是程式的路徑
//     // // webPath 是公開的資料夾
//     // // pathname 是使用者要求的路徑名稱
//     const filePath = path.join(__dirname, webPath, pathname);

//     // // 讀取檔案
//     fs.readFile(filePath, 'utf8', (err, content) => {
//         if (err) {
//             // console.log('Failed to read');
//             // 若檔案讀取錯誤，回傳 404
//             res.writeHead(404, { 'image/png': 'text/html' });
//             res.end();
//             return;
//         }
//         // 將檔案內容傳給瀏覽器
//         // res.writeHead(200, { 'Content-Type': 'text/' });
//         res.write(content);
//         res.end();
//     });

//     // res.writeHead(200, {
//     //     'Content-Type': 'text/plain',
//     // });
//     // res.end('Hello Azure!');
// });

// // 設定 port 預設為 1337，若系統環境有設定則以系統環境設定為主
// const port = process.env.PORT || 1337;
// server.listen(port);

// // console.log('Server running at http://localhost:%d', port);

// // var server = http.createServer(function(req, res) {

// // });

// // var http = require('http');
// // var port = process.env.port || 1337;
// // http.createServer(function (req, res) {
// //     res.writeHead(200, { 'Content-Type': 'text/plain' });
// //     res.end('Hello World\n');
// // }).listen(port);

// // // 載入 http 的模組
// // var http = require('http');
// // // 引用 File System 模組
// // var fs = require('fs');

// // // 設定 port 預設為 1337，若系統環境有設定則以系統環境設定為主
// // var port = process.env.PORT || 1337;

// // var url = require('url');
// // var path = require('path');

// // var file_content;

// // var webPath = 'docs';

// // var server = http.createServer(function(req, res) {
// //     // req 是 request 本地端請求的訊息
// //     // res 是 response 主機回傳到本地端的訊息

// //     // 解析使用者要求的路徑名稱
// //     var url_path = url.parse(req.url);
// //     console.log('path:' + url_path);
// //     var pathname = url_path.pathname;
// //     console.log('pathname:' + pathname);

// //     // 判斷pathname是否為預設路徑
// //     if (pathname === "/" || pathname === "/index.htm") {
// //         pathname = 'index.html';
// //     }

// //     // __dirname 是程式的路徑
// //     // webPath 是公開的資料夾
// //     // pathname 是使用者要求的路徑名稱
// //     var filePath = path.join(__dirname, webPath, pathname);
// //     console.log('filePath:' + filePath);


// //     // 讀取檔案
// //     fs.readFile(filePath, 'utf8', function(err, content) {
// //         if (err) {
// //             console.log('Failed to read');
// //             // 若檔案讀取錯誤，回傳 404
// //             res.writeHead(404, { 'Content-Type': 'text/html' });
// //             res.end();
// //             return;
// //         }
// //         // 將檔案內容傳給瀏覽器
// //         //res.writeHead(200, { 'Content-Type': 'text/' });
// //         res.write(content);
// //         // res.writeHead(200, {
// //         //     'Content-Type': content,
// //         // });
// //         res.end();
// //     });
// // });

// // // 啟動並等待連接
// // server.listen(port);
// // console.log('Server running at http://127.0.0.1:/' + port);