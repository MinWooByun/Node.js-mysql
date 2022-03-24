const db = require("./db.js");
const template = require("./template.js");
// 하나만 이용할 때는 module.exports 즉, 파일명 ex) template.~~~식으로 사용하려면 module.exports을 이용하고
// 여러개를 하나의 함수로만 이용할 때는 exports을 사용한다.
// 홈페이지
exports.home = (request, response) => {
  db.query("SELECT * FROM topic", (err, topics) => {
    if (err) throw err;
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
};

// 상세페이지
exports.page = (request, response, queryData) => {
  db.query(`SELECT * FROM topic`, (err, topics) => {
    if (err) throw err;
    db.query(
      `SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id=?`,
      [queryData.id],
      (err, topic) => {
        if (err) throw err;
        const title = topic[0].title;
        const description = topic[0].description;
        const list = template.list(topics);
        const html = template.HTML(
          title,
          list,
          `
              <h2>${title}</h2>
              ${description}
              <p>by ${topic[0].name}</p>
              `,
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
      }
    );
  });
};

exports.create = (request, response) => {
  db.query("SELECT * FROM topic", (err, topics) => {
    if (err) throw err;
    db.query(`SELECT * FROM author`, (err2, authors) => {
      if (err2) throw err2;
      const title = "Create";
      const list = template.list(topics);
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
              ${template.authorSelect(authors, "")}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
        `<a href="/create">create</a>`
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_process = (request, response) => {
  let body = "";
  request.on("data", function (data) {
    body += data;
  });
  request.on("end", function () {
    const title = new URLSearchParams(body).get("title");
    const description = new URLSearchParams(body).get("description");
    const authorId = new URLSearchParams(body).get("author");
    db.query(
      `INSERT INTO topic(title, description, created, author_id) VALUES(?, ?, Now(), ?)`,
      [title, description, authorId],
      (err, result) => {
        if (err) throw err;
        // result.insertId는 방금 INSERT한 row의 id값을 가져온다.
        response.writeHead(302, { Location: `/?id=${result.insertId}` });
        response.end();
      }
    );
  });
};

exports.update = (request, response, queryData) => {
  db.query(`SELECT * FROM topic`, (err, topics) => {
    if (err) throw err;
    db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], (err2, topic) => {
      if (err2) throw err2;
      db.query(`SELECT * FROM author`, (err3, authors) => {
        if (err3) throw err3;
        const list = template.list(topics);
        const html = template.HTML(
          topic[0].title,
          list,
          `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${topic[0].id}"/>
              <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"/></p>
              <p>
                <textarea name="description" placeholder="discription">${
                  topic[0].description
                }</textarea>
              </p>
              <p>
                ${template.authorSelect(authors, topic[0].author_id)}
              </p>
              <p><input type="submit"/></p>
             </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  });
};

exports.update_process = (request, response) => {
  let body = "";
  request.on("data", function (data) {
    body += data;
  });
  request.on("end", function () {
    const id = new URLSearchParams(body).get("id");
    const title = new URLSearchParams(body).get("title");
    const description = new URLSearchParams(body).get("description");
    const authorId = new URLSearchParams(body).get("author");
    db.query(
      `UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
      [title, description, authorId, id],
      (err, result) => {
        if (err) throw err;
        response.writeHead(302, { Location: `/?id=${id}` });
        response.end();
      }
    );
  });
};

exports.delete_process = (request, response) => {
  let body = "";
  request.on("data", function (data) {
    body += data;
  });
  request.on("end", function () {
    const id = new URLSearchParams(body).get("id");
    db.query(`DELETE FROM topic WHERE id=?`, [id], (err, result) => {
      if (err) throw err;
      response.writeHead(302, { Location: `/` });
      response.end();
    });
  });
};
