var derby = require('derby');

module.exports = function () {
  var app = derby.createApp('client', __filename);
  app.loadViews(__dirname);
  app.loadStyles(__dirname);
  return app;
};
