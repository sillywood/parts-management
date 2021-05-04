var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressJwt = require('express-jwt');

let tokenServe = require('./src/modules/common/token')

let captchaRouter = require('./src/modules/system/controller/captchaController')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const login = require('./src/modules/system/controller/loginController')

var app = express();





//验证token是否过期并规定哪些路由不用验证
app.use(expressJwt({
  secret: 'yhjx_token',
  algorithms:['HS256']
}).unless({
  path: ['/', '/login','/captcha.jpg']     //除了这个地址，其他的URL都需要验证
}));




// 解析用户信息
app.use(function (req, res, next) {
  // console.log(req.url);

  // 绕开验证码和登录不做用户信息验证
  if(/captcha\.jpg/g.test(req.url) || /login/g.test(req.url)){
    return next()
  }
  let token = req.headers['cookie'].token
  if (token == undefined) {
    return next();
  } else {
    tokenServe.verToken(token).then((data) => {
      req.data = data;
      return next();
    }).catch((error) => {
      console.log(error);
      return next();
    })
  }
});



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/login", login)
app.use("/captcha.jpg", captchaRouter)


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
