# URL Shortener 短網址產生器

## 介紹

這是一個可以將網址縮短的短網址產生器

### 功能描述

- 輸入網址並轉換為短連結
- 使用短連結瀏覽原始連結的網站
- 一鍵複雜短連結

![URL_Shortener](https://user-images.githubusercontent.com/32502651/218317075-520eb0a0-65f3-42be-8ee0-be3ab4d42d73.jpg)

## 環境建置與需求

- [Node.js](https://nodejs.org/en/)
- [Node Package Manager](https://www.npmjs.com/)
- [Express](https://www.npmjs.com/package/express)
- [Express-Handlebars](https://www.npmjs.com/package/express-handlebars)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Mongoose](https://mongoosejs.com/)
- [alert] (https://www.npmjs.com/package/alert)
- [body-parser] (https://www.npmjs.com/package/body-parser)
- [valid-url] (https://www.npmjs.com/package/valid-url)

## 安裝與執行步驟

1. 開啟終端機(Terminal)，將專案 Clone 到本機電腦

```
git clone https://github.com/HKMark/url_shortener.git
```

2. 進入存放此專案的資料夾

```
cd url_shortener
```

3. 安裝 npm 套件

```
npm install
```

4. 設定你的 MongoDB 連接

5. 啟動伺服器
```
npm run dev
```

當終端機顯示"Express is listening on localhost:3000"，代表啟動成功，你可以在瀏覽器輸入 http://localhost:3000 瀏覽內容。
