var derby = require('derby');
var app = module.exports = derby.createApp('client', __filename);
app.loadViews(__dirname);
app.loadStyles(__dirname);
