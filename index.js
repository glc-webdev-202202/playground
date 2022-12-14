var express = require('express');
var path = require('path');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);
app.use('/users', usersRouter);

app.listen(808800, () => {
    console.log("server is running!!!! 서버 작동중!!");
})
