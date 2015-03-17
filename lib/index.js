var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var inlineCss = require('inline-css');
var path = require('path');
var Render = require('derby-render');
var viewFns = require('./viewFns');

var defaults = {
  css: {url: 'filePath'},
  data: {},
  ns: '',
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
  ]
};

module.exports = function (app, opts) {
  opts = _.merge({}, defaults, opts || {});
  app.proto.$formatEmail = viewFns.$formatEmail;
  app.views.register('Page', '<view name="{{$render.ns}}" />');

  _.each(opts.fields, function (field) {
    var innerView = field[0].toUpperCase() + field.substring(1);
    var outerView = innerView + 'Element';
    var outerHtml = '<view name="{{$render.prefix}}' + innerView + '" />';
    if (app.views.find(outerView)) return;
    if (field !== 'html') return app.views.register(outerView, outerHtml);
    outerHtml = fs.readFileSync(path.join(__dirname, 'views.html'), 'utf8');
    app.views.register(outerView, outerHtml);
  });

  var render = Render(app, opts);

  return function (ns, data, cb) {
    if (typeof ns === 'object') {cb = data; data = ns; ns = opts.ns;}
    else if (typeof data === 'function') {cb = data; data = {};}
    else if (typeof ns === 'function') {cb = ns; data = {}; ns = opts.ns;}
    var results = {};

    function getResult(field, done) {
      var view = field[0].toUpperCase() + field.substring(1) + 'Element';
      render(ns + ':' + view, data, function (err, result) {
        if (err) return done(err);
        if (result) results[field] = result;
        done();
      });
    }

    async.each(opts.fields, getResult, function (err) {
      if (err) return cb(err);
      if (!results.html) return cb(null, results);
      inlineCss(results.html, opts.css, function (err, html) {
        if (err) return cb(err);
        results.html = html;
        cb(null, results);
      });
    });
  };
};
