const sanitizeHtml = require("sanitize-html");

module.exports = {
  HTML: function (title, list, body, control) {
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list: function (topics) {
    var list = "<ul>";
    var i = 0;
    while (i < topics.length) {
      list += `<li><a href="/?id=${topics[i].id}">${sanitizeHtml(topics[i].title)}</a></li>`;
      i += 1;
    }
    list += "</ul>";
    return list;
  },
  authorSelect: (authros, author_id) => {
    let tag = `<select name="author">`;
    for (let i = 0; i < authros.length; i++) {
      let selected = "";
      if (authros[i].id === author_id) {
        selected = "selected";
      }
      tag += `<option value="${authros[i].id}" ${selected}>${sanitizeHtml(authros[i].name)}</option>`;
    }
    tag += `</select>`;
    return tag;
  },
  authorTable: (authors) => {
    let tag = "";
    for (let i = 0; i < authors.length; i++) {
      tag += `
        <tr>
            <td>${sanitizeHtml(authors[i].name)}</td>
            <td>${sanitizeHtml(authors[i].profile)}</td>
            <td><a href="/author/update?id=${authors[i].id}">update</a></td>
            <td>
              <form action="/author/delete_process" method="post">
                <input type="hidden" name="id" value="${authors[i].id}">
                <input type="submit" value="delete">
              </form>
            </td>
        </tr>`;
    }
    return tag;
  },
};
