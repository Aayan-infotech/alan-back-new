const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const fileUpload = require("express-fileupload");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Uploads Directory Ensure
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(cors({
  origin: ["http://localhost:5173", "http://18.221.196.222:2040", "http://localhost:7878"],
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Static file serving for uploads & page
app.use("/uploads", express.static(uploadDir));
app.use("/page", express.static(uploadDir));

// Serve index.html on root route
app.get("/", (req, res) => {
  console.log("Serving index.html");
  res.sendFile(path.join(uploadDir, "index.html"));
});

// Database Connection
connectDB();

// Routes
const WishlistRoutes = require("./routes/WishlistRoutes");
// (Add other route imports here)

app.use("/api/wishlist", WishlistRoutes);
// (Add other route usages here)

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
