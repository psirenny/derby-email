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

  // create views and render functions for each field
  // i.e. subject -> SubjectElement: and Subject:
  //      html    -> HtmlElement: and Html:
  opts.fields.forEach(function (field) {
    var view = field[0].toUpperCase() + field.substring(1);
    var src =  '<view name="{{$render.prefix}}' + view + '"></view>';
    app.views.register(view + 'Element', src);
    var hasView = !!app.views.nameMap[view];
    if (!hasView) app.views.register(view, '');
    var render = merge(true, {}, opts.render, {view: view + 'Element'});
    cache[field] = Render(app, render);
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
