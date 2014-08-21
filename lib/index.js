var fs = require('fs');
var juice = require('juice');
var merge = require('node.extend');
var path = require('path');
var Render = require('derby-render');

module.exports = function (app, opts) {
  var defaults = {
    fields: [
      'bcc',
      'cc',
      'from',
      'html',
      'inReplyTo',
      'references',
      'replyTo',
      'subject',
      'text',
      'to'
    ],
    render: {},
    styles: {url: 'file://'}
  };

  opts = merge(true, defaults, opts);
  var cache = {};

  // cache render functions for each field (html, subject, etc...)
  opts.fields.forEach(function (field) {
    var view = field[0].toUpperCase() + field.substring(1);
    var render = Render(app, merge(true, {}, opts.render, {view: view}));
    cache[field] = render;
  });

  // register the default html view
  var defaultView = path.join(__dirname, 'index.html');
  defaultView = fs.readFileSync(defaultView, 'utf8');
  app.views.register('Html', defaultView);

  // map fields to evaluated render functions
  return function (ns, data, callback) {
    var results = {};
    if (!callback) callback = data || ns;

    for (var field in cache) {
      var render = cache[field];
      var html = render(ns, data);
      results[field] = html;
    }

    juice.juiceContent(results.html, opts.styles, function (err, html) {
      if (err) return callback(err);
      results.html = html;
      callback(null, results);
    });
  };
};
