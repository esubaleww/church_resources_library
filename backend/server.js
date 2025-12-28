const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/resources", require("./routes/resource"));
app.use("/api/prayers", require("./routes/prayer"));
app.use("/api/events", require("./routes/event"));

app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.send("Welcome to the Orthodox Resource Center API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
