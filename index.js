var express = require('express');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use("/", indexRouter);
app.use('/users', usersRouter);
app.set('view engine', 'pug')

app.listen(8080, () => {
    console.log("server is running!!!!");
})