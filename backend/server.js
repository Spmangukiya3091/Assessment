const express = require("express");
const mongoose = require("mongoose");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const routes = require("./routes/routes");
mongoose.connect("mongodb+srv://sahilMangukiya:sahil3091@cluster0.zl2ok.mongodb.net/employeeManagementDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
