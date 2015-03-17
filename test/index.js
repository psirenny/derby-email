process.env.NODE_ENV = 'production';
var fixture = require('./fixture');
var lib = require('..');
var test = require('tape');

test('lib', function (t) {
  t.plan(1);
  t.equal(typeof lib, 'function');
});

test('app.proto.$formatEmail', function (t) {
  t.plan(2);
  var app = fixture.app();
  var render = lib(app);
  t.equal(typeof app.proto.$formatEmail, 'function');
  t.equal(app.proto.$formatEmail('foo', 'foo@bar.com'), 'foo <foo@bar.com>');
});

test('render', function (t) {
  t.plan(5);
  var render = lib(fixture.app());
  t.equal(typeof render, 'function');
  var data = {_page: {from: {}}};
  data._page.subject = 'Test';
  data._page.from.name = 'foo';
  data._page.from.address = 'foo@bar.com';
  render(data, function (err, results) {
    t.error(err);
    t.equal(results.from, fixture.expected.from.trim());
    t.equal(results.html, fixture.expected.html.trim());
    t.equal(results.subject, fixture.expected.subject.trim());
  });
});
