let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

const mongoose = require("mongoose")

const expressJwt = require('express-jwt');
const bodyParser = require('body-parser')


let tokenServe = require('./src/modules/common/token')

let captchaRouter = require('./src/modules/system/controller/captchaController')
let indexRouter = require('./routes/index');
const usersRouter = require('./src/modules/system/controller/userController');


const login = require('./src/modules/system/controller/loginController')
const logout = require('./src/modules/system/controller/logoutController')
const menuRouter = require('./src/modules/system/controller/menuController')
const roleRouter = require('./src/modules/system/controller/roleController')
const storageRouter = require('./src/modules/partsManagement/controller/index')
let app = express();

app.SUPER_USER = 1;
// app.use(express.urlencoded())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// 链接数据库
 mongoose.connect('mongodb://localhost:27017/partsManagement',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
mongoose.connection.once('open', () => {
  console.log('数据库已连接');
 })

mongoose.connection.once('close', () => {
  console.log('数据库已断开连接');
})




//验证token是否过期并规定哪些路由不用验证
app.use(expressJwt({
  secret: 'yhjx_token',
  algorithms:['HS256'],
  getToken: function fromCookie(req) {
    // console.log(req.headers['token']);
    //尝试从cookie读取token进行验证
    if (req.headers['token'])
      return req.headers['token'];
    return null;
  }
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
  let token = req.headers['token']
  if (token == undefined) {
    return next();
  } else {
    tokenServe.verToken(token).then((data) => {
      // console.log("app:67===========================")
      // console.log(data);
      req.data = data;
      return next();
    }).catch((error) => {
      console.log(error);
      return next();
    })
  }
});



app.use('/', indexRouter);
app.use('/user', usersRouter(app));
app.use("/login", login)
app.use("/captcha.jpg", captchaRouter)
app.use("/logout", logout)
app.use("/menu",menuRouter(app))
app.use("/role",roleRouter(app))
app.use("/storage", storageRouter)


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
