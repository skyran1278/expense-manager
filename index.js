const http = require('http');
const url = require('url');
const path = require('path');

// 引用 File System 模組
const fs = require('fs');

// const file_content;
const webPath = 'docs';

const server = http.createServer((req, res) => {
    // // 解析使用者要求的路徑名稱
    const urlPath = url.parse(req.url);
    let pathname = urlPath.pathname;

    // // 判斷pathname是否為預設路徑
    if (pathname === '/' || pathname === '/index.htm') {
        pathname = 'index.html';
    }

    // // __dirname 是程式的路徑
    // // webPath 是公開的資料夾
    // // pathname 是使用者要求的路徑名稱
    const filePath = path.join(__dirname, webPath, pathname);

    // // 讀取檔案
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            // console.log('Failed to read');
            // 若檔案讀取錯誤，回傳 404
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end();
            return;
        }
        // 將檔案內容傳給瀏覽器
        // res.writeHead(200, { 'Content-Type': 'text/' });
        res.writeHead(200, {
            'Content-Type': content,
        });
        res.end();
    });

    // res.writeHead(200, {
    //     'Content-Type': 'text/plain',
    // });
    // res.end('Hello Azure!');
});

// 設定 port 預設為 1337，若系統環境有設定則以系統環境設定為主
const port = process.env.PORT || 1337;
server.listen(port);

// console.log('Server running at http://localhost:%d', port);

// var server = http.createServer(function(req, res) {

// });
