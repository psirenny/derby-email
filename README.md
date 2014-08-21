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

    <From:>
      {{unescaped $formatEmail('app', from)}}

    <Body:>
      <p>Some text.</p>

    <Text:>
      Some text.

Any view named after a field and capitalized will be returned as a result.

**other.html**

    <Subject:>
      Hello {{username}}

    <Body:>
      <p>foo bar</p>

    <Text:>
      foo bar

Send your email:

    var derby = require('derby');
    var app = derby.createApp('app', __filename);
    var email = require('derby-email')(app);
    app.loadViews(...);
    app.loadStyles(...);

    function send(err, results) {
      console.log(results);
      // prints {html: '...', subject: '...', text: '...'}
    };

    // return email options
    email(send);

    // or for a specific page
    html = email('other', {username: 'user'}, send);

View Functions
--------------

The following view functions are available in your views:

**$formatEmail(name, address)** – Returns a formatted email address. i.e. `name <foo@bar.com>`. You must unescape the function for the `<` and `>` to render correctly.

Options
-------

**fields** – The fields (views) to render and return. Includes: html, text, subject, from, to, etc...

**render** – Configuration options passed to derby-render. See [derby-render](https://github.com/psirenny/derby-render).

**styles** – Configuration options passed to juice. See [juice](https://github.com/Automattic/juice).
