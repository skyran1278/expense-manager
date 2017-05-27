<p align="center"><a href="#" target="_blank"><img width="150" src="https://github.com/skyran1278/Expense-Manager/blob/firebase/icons/playstore/icon.png"></a></p>

<p align="center">
<!--   <a href="/"><img src="https://img.shields.io/github/downloads/skyran1278/20170324-Account/latest/total.svg" alt="Downloads"></a> -->
  <a href="#"><img src="https://img.shields.io/github/release/skyran1278/Expense-Manager.svg" alt="Version"></a>
  <a href="#"><img src="https://img.shields.io/github/license/skyran1278/Expense-Manager.svg" alt="License"></a>
</p>

## Expense Manager

> Expense Manager is not just a expense record.
>
> It can manage your life if you get used to its 'Manager'!

## Chrome Extension

Adds a Expense Manager in the Chrome, which on click new blank opens page directly into Expense Manager.

* [Chrome Extension](https://goo.gl/YPmDnM)
* [Azure Web with Broken Figure](http://expense-manager.azurewebsites.net/)
* [Github Web with Always Reload](https://skyran1278.github.io/Expense-Manager/)
* [Source](https://github.com/skyran1278/Expense-Manager/tree/master/docs)

## Major Update

- Firebase + Chart.js + Uuid
- 實作完成
  - [x] 使用者個人化資料
  - [x] 串接 Google 與 Facebook API
  - [x] 無資料時顯示 Add New Expense Button
  - [x] input select 改成 button 併點選時更改 button 狀態
  - [x] 日期自動預設為今天
  - [x] 等待途中增加 Loading 圖示
  - [x] 使用模板語言開發，減少重複使用
  - [x] 增加收入功能
  - [x] 新增 Detailed 頁面，加快 Index 載入速度
  - [x] 紀錄以時間倒序排列，方便查閱
  - [x] 收入與支出 canvas

## Next Possible Step

- 資料庫換成 [MongoDB](https://www.mongodb.com/)
- 轉用 [Express](http://expressjs.com/zh-tw/) 路由去 render 網頁
- 使用 [Vue.js](https://cn.vuejs.org/v2/guide/) 來實作
- 登入登出使用 [Passport](http://passportjs.org/)
- canvas 可以變成 slide show **Not Beautiful, so delete it.**
- 增加多個專案功能
- 刪除回復功能
- 個人化設定 Type Button
- [忘記密碼與信箱驗證功能](https://firebase.google.com/docs/auth/web/manage-users#send_a_user_a_verification_email)

## Changelog

Details changes for each release are documented in the [release notes](https://github.com/skyran1278/20170324_ExpenseManager/releases).

## License

All of the codebases are **MIT licensed** unless otherwise specified.
