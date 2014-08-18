var fixture = require('./fixture');
var lib = require('..');
var should = require('chai').should();

describe('derby-email', function () {
  it('should be a function', function () {
    lib.should.be.a('function');
  });

  it('should return a render function', function () {
    var render = lib(fixture.app);
    render.should.be.a('function');
  });

  describe('results', function () {
    it('should be an object', function (done) {
      var render = lib(fixture.app);
      render(function (err, results) {
        results.should.be.an('object');
        done();
      });
    });

    it('should have the default properties', function (done) {
      var render = lib(fixture.app);
      render(function (err, results) {
        results.should.have.property('bcc');
        results.should.have.property('cc');
        results.should.have.property('html');
        results.should.have.property('inReplyTo');
        results.should.have.property('references');
        results.should.have.property('replyTo');
        results.should.have.property('subject');
        results.should.have.property('text');
        results.should.have.property('from');
        results.should.have.property('to');
        done();
      });
    });

    it('should return the expected results', function (done) {
      var data = {username: 'user'};
      var render = lib(fixture.app);
      var results = render(data, function (err, results) {
        results.html.should.eql(fixture.expected.html);
        results.subject.should.eql(fixture.expected.subject);
        results.text.should.eql(fixture.expected.text);
        done();
      });
    });
  });
});
