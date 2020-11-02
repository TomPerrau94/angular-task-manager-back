const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const formidable = require("express-formidable");

const listRoutes = require("./routes/list.routes");
const taskRoutes = require("./routes/task.routes");
const userRoutes = require("./routes/user.routes");

const { List, Task, User } = require("./models");

const app = express();
app.use(formidable());
app.use(cors());

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(listRoutes);
app.use(taskRoutes);
app.use(userRoutes);

app.get("*", (req, res) => {
  res.status(200).json({ message: "App started" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
