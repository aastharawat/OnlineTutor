

const connection = require('./components')

const express = require("express");

const app = express();
const path = require("path");
const expressHandlerbars = require("express-handlebars");
const bodyparser = require("body-parser")
const CourseController = require("./controllers/courses")
app.use(bodyparser.urlencoded({
    extended: true
}));

app.engine('handlebars', expressHandlerbars());
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, "/views/")));
app.use("/course", CourseController)

app.get("/", (req, res) =>{
    res.render("index", {})
})

app.listen(8000);