'use strict'

/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var session = require('express-session');

var app = module.exports = express();

// config

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware

app.use(express.urlencoded({ extended: TRUE }))
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'asdf!@#$qwersss'
}));

// Session-persisted message middleware

app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

// dummy database

var users = {
  tj: { name: 'tj', password: 'nametj' }
};

function authenticate(name, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', name, pass);
  var user = users[name];
  if (!user) return fn(null, null)
  if (pass === user.password) return fn(null, user)
  fn(null, null)
}


app.get('/', function(req, res){
  res.redirect('/login');
});

app.get('/restricted', function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = '절대 접근 금지!';
    res.redirect('/login');
  }
}, function(req, res){
  res.send('로그인 성공! <a href="/logout">로그아웃Z</a>');
});

app.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', function (req, res, next) {
  authenticate(req.body.username, req.body.password, function(err, user){
    if (err) return next(err)
    if (user) {
      req.session.regenerate(function(){
        req.session.user = user;
        req.session.success = 'username: ' + user.name
          + ' <a href="/logout">로그아웃</a>. '
          + ' <a href="/restricted">로그인 확인~~</a>.';
        res.redirect('back');
      });
    } else {
      req.session.error = '비밀번호가 틀렸습니다. 다시해봐라~ '
        + ' (use "tj" and "foobar")';
      res.redirect('/login');
    }
  });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
