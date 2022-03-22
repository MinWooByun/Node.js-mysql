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
      list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i += 1;
    }
    list += "</ul>";
    return list;
  },
  authorSelect: (authros) => {
    let tag = `<select name="author">`;
    for (let i = 0; i < authros.length; i++) {
      tag += `<option value="${authros[i].id}">${authros[i].name}</option>`;
    }
    tag += `</select>`;
    return tag;
  },
};
