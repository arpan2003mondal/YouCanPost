const express = require("express");
const app = express();

const path = require("path");
const cookieParser = require("cookie-parser");
const db = require("./config/mongoose-connection");



const usersRouter = require("./routes/usersRouter");
const postsRouter = require("./routes/postsRouter");
const indexRouter = require("./routes/index");


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());



app.use("/",indexRouter);
app.use("/users",usersRouter);
app.use("/posts",postsRouter);


app.set("view engine","ejs");



 app.listen(3000);   // Starts the server, listening on port 3000 for incoming requests.