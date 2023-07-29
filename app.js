require('dotenv').config();

const {categoryMiddleware, loggedInMiddleware, cartProducts} = require("./middlewares/custom.middleware")
const path = require('path');
const express = require("express");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const multer = require("multer");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')

//route middlewears
const adminRouter = require('./routes/admin.router');
const userRouter = require('./routes/user.router');
const app = express();

//view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//global middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use(xss());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('short'));
app.use(cors());

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

//custom middlewares
app.use(categoryMiddleware);
app.use(loggedInMiddleware);
app.use(cartProducts);

mongoose.set("strictQuery", false);

const port = process.env.PORT || 3000;
const url =
  process.env.MONGO_DB
  

// connect to database
mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => console.log("MongoDb is connected!🚀"))
  .catch((err) => console.log(err));

// route middlewares
app.use('/admin', adminRouter);
app.use('/', userRouter);

console.clear()

app.listen(port, function () {
  console.log("Express app running on port " + port+"🚀");
});
