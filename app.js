

require('./components')
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const CourseController = require("./controllers/courses")

var cors = require('cors')
app.use(cors())

app.use("/course", CourseController)

app.listen(8000);