const db = require("./db.js");
const template = require("./template.js");

exports.home = (request, response) => {
  db.query("SELECT * FROM topic", (err, topics) => {
    if (err) throw err;
    db.query("SELECT * FROM author", (err2, authors) => {
      if (err2) throw err2;
      const title = "author";
      const list = template.list(topics);
      const html = template.HTML(
        title,
        list,
        `
        <form action="/author/create_process" method="post">
          <p><input type="text" name="name" placeholder="name"></p>
          <p>
            <textarea name="profile" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit" value="create">
          </p>
        </form>
        `,
        `
            <table>
                ${template.authorTable(authors)}
            </table>
            <style>
                table{
                    border-collapse: collapse;
                }
                td{
                    border: 1px solid black;
                }
            </style>
          `
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_author_process = (request, response) => {
  let body = "";
  request.on("data", function (data) {
    body += data;
  });
  request.on("end", function () {
    const name = new URLSearchParams(body).get("name");
    const profile = new URLSearchParams(body).get("profile");
    db.query(`INSERT INTO author(name, profile) VALUES(?, ?)`, [name, profile], (err, result) => {
      if (err) throw err;
      // result.insertId는 방금 INSERT한 row의 id값을 가져온다.
      response.writeHead(302, { Location: `/author` });
      response.end();
    });
  });
};
