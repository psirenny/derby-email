Derby Email
===========

Create emails using [Derby JS](http://derbyjs.com) apps/templates.
It uses [derby-render](https://github.com/psirenny/derby-render) to render views and [juice](https://github.com/Automattic/juice) to inline styles.  

[![Build Status](https://travis-ci.org/psirenny/derby-email.png?branch=master)](https://travis-ci.org/psirenny/derby-email)

For convenience, the default results returned match the values read by [nodemailer](https://github.com/andris9/Nodemailer).

Installation
------------

    $ npm install derby-email --save

Usage
-----

Create your views:

**index.html**

    <import: src="./other">

    <From:>
      {{unescaped $formatEmail('app', 'foo@bar.com')}}

    <Html:>
      <p>Some text.</p>

    <Text:>
      Some text.

Any view named after a field and capitalized will be returned as a result.

**other.html**

    <Subject:>
      Hello {{user}}

    <Html:>
      <p>foo bar</p>

    <Text:>
      foo bar

Send your email:

    var derby = require('derby');
    var app = derby.createApp('app', __filename);
    var email = require('derby-email')(app);
    var nodemailer = require('nodemailer');
    app.loadViews(...);
    app.loadStyles(...);

    function send(err, emailOptions) {
      var transporter = nodemailer.createTransports(...);
      transporter.send(emailOptions, function (err, info) {
        ...
      })
    };

    // return email options
    email(send);

    // with data
    var data = {_page: {userId: '...'}};
    email(data, send);

    // with a specific page (namespace)
    email('welcome', send);

    // or with both
    email('welcome', data, send);

View Functions
--------------

The following view functions are available in your views:

**$formatEmail(name, address)** – Returns a formatted email address. i.e. `name <foo@bar.com>`.

Options
-------

All options are also passed in to derby-render. See [derby-render](https://github.com/psirenny/derby-render) for a list of options.

**fields** – The fields (views) to render and return. Includes: html, text, subject, from, to, etc. See [Nodemailer](https://github.com/andris9/Nodemailer) for a list of suggested fields.

**css** – Configuration options passed to inline-css. See [inline-css]https://github.com/jonkemp/inline-css).
