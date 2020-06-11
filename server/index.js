const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Mongo DB Connected....");
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => res.send("Hello World?"));

app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);
  user.save((error, result) => {
    if (error) return res.json({ success: false, error });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  User.findOne(
    {
      email: req.body.email,
    },
    (error, result) => {
      if (!result) {
        return res.json({
          loginSuccess: false,
          message: " 해당되는 이메일이 없습니다",
        });
      } else {
        result.comparePassword(req.body.password, (error, isMatch) => {
          if (!isMatch)
            return res.json({
              loginSuccess: false,
              message: "비밀번호가 틀렸습니다",
            });

          result.generateToken((error, user) => {
            if (error) return res.status(400).send(error);

            res
              .cookie("x_auth", user.token)
              .status(200)
              .json({ loginSuccess: true, userId: user._id });
          });
        });
      }
    }
  );
});

app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (error, user) => {
    if (error) return res.json({ success: false, error });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
