const express = require("express");
const connectToDB = require("./configs/db");
const userRouter = require("./routes/userRoute");
const limiter = require("./middlewares/rateLimit");
const cors = require("cors");
const searchHistoryRouter = require("./routes/searchHistoryRoute");

require("dotenv").config();
const app = express();
app.use(cors());

const port = process.env.PORT || 9090;
const db_url = process.env.DB_URL;

app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.send("This is a home route");
});

app.use(limiter);

app.use('/user', userRouter);
app.use('/history', searchHistoryRouter);

app.listen(port, async () => {
  try {
    await connectToDB(db_url);
    console.log('Successfully connected to the database');
    console.log(`Server is running at http://localhost:${port}`);
  } catch (err) {
    console.log(err);
    console.log("Error connecting to the database");
  }
});
