var fs = require('fs');
var path = require('path');

exports.app = require('./app');
exports.expected = {};
exports.expected.from = fs.readFileSync(path.join(__dirname, 'expected/from.txt'), 'utf8').trim();
exports.expected.html = fs.readFileSync(path.join(__dirname, 'expected/html.html'), 'utf8');
exports.expected.subject = fs.readFileSync(path.join(__dirname, 'expected/subject.txt'), 'utf8').trim();
