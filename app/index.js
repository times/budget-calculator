module.exports = name => (locals, callback) => {
  const htmlBefore = `
    <html>
      <head>
        <meta charset="UTF-8">
        <link rel="import" href="../polymer/polymer.html">
      </head>

      <body>
  `;

  const htmlMiddle = require(`raw-loader!./${name}/index.html`);

  const htmlAfter = `
      </body>
    </html>
  `;

  const fullHtml = htmlBefore + htmlMiddle + htmlAfter;

  callback(null, fullHtml);
};
