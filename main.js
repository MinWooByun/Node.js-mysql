const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const template = require("./lib/template.js");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "111111",
  database: "opentutorials",
});
db.connect();

const app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;
  if (pathname === "/") {
    if (queryData.id === undefined) {
      db.query("SELECT * FROM topic", (err, topics) => {
        const title = "Welcome";
        const description = "Hello, Node.js";
        const list = template.list(topics);
        const html = template.HTML(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    } else {
      db.query(`SELECT * FROM topic`, (err, topics) => {
        if (err) throw err;
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], (err, topic) => {
          if (err) throw err;
          const title = topic[0].title;
          const description = topic[0].description;
          const list = template.list(topics);
          const html = template.HTML(
            title,
            list,
            `<h2>${title}</h2>${description}`,
            `
            <a href="/create">create</a>
            <a href="/update?id=${queryData.id}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${queryData.id}">
              <input type="submit" value="delete">
            </form>
            `
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", function (error, filelist) {
      const title = "WEB - create";
      const list = template.list(filelist);
      const html = template.HTML(
        title,
        list,
        `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,
        ""
      );
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === "/create_process") {
    const body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      // const post = qs.parse(body);
      const title = new URLSearchParams(body).get("title");
      const description = new URLSearchParams(body).get("description");
      fs.writeFile(`data/${title}`, description, "utf8", function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  } else if (pathname === "/update") {
    fs.readdir("./data", function (error, filelist) {
      const filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
        const title = queryData.id;
        const list = template.list(filelist);
        const html = template.HTML(
          title,
          list,
          `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === "/update_process") {
    const body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      // const post = qs.parse(body);
      const id = new URLSearchParams(body).get("id");
      const title = new URLSearchParams(body).get("title");
      const description = new URLSearchParams(body).get("description");
      fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, "utf8", function (err) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
      });
    });
  } else if (pathname === "/delete_process") {
    const body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      // const post = qs.parse(body);
      const id = post.id;
      const filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function () {
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
