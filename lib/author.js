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
          `,
        `<a href="/create">create</a>`
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};
