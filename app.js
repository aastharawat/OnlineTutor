

require('./components')
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const CourseController = require("./controllers/courses");
const UserController = require("./controllers/users")


var cors = require('cors')
app.use(cors())

app.use("/course", CourseController)
app.use("/user", UserController)

app.listen(8000);