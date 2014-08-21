var fs = require('fs');
var juice = require('juice');
var merge = require('node.extend');
var path = require('path');
var Render = require('derby-render');
var viewFns = require('./viewFns');

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

  // register default view functions
  viewFns(app);

  // register the default html view
  var defaultView = path.join(__dirname, 'view.html');
  defaultView = fs.readFileSync(defaultView, 'utf8');
  app.views.register('Html', defaultView);

  // cache render functions for each field (from, to, html, subject, etc...)
  var cache = {};

  opts.fields.forEach(function (field) {
    var view = field[0].toUpperCase() + field.substring(1);

    // create a wrapper view that routes to the correct namespace
    var src =  '<view name="{{$render.prefix}}' + view + '"></view>';
    app.views.register(view + 'Element', src);

    // create an empty view if it does not exist
    var hasView = !!app.views.nameMap[view];
    if (!hasView) app.views.register(view, '');

    // create a render function for the wrapper view
    var renderOpts = merge(true, {}, opts.render, {view: view + 'Element'});
    cache[field] = Render(app, renderOpts);
  });

  return function (ns, data, callback) {
    var results = {};
    if (!callback) callback = data || ns;

    // render each field with the provided namespace and data
    for (var field in cache) {
      var render = cache[field];
      var html = render(ns, data);
      results[field] = html;
    }

    // inline css for the html field
    juice.juiceContent(results.html, opts.styles, function (err, html) {
      if (err) return callback(err);
      results.html = html;
      callback(null, results);
    });
  };
};
