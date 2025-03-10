const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const uploadDir = require("path").join(__dirname, "uploads");
const fs = require("fs");
const session = require("express-session");
const fileUpload = require("express-fileupload");

dotenv.config();

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(fileUpload());
app.use("/uploads", express.static("uploads"));

// const cors = require("cors");
app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://54.236.98.193:2040", "http://localhost:7878"],
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

connectDB();

const AppointmentRoutes = require("./routes/appointmentRoute");
const adminUserManageRoutes = require("./routes/adminUserManageRoutes");
const categoryRoutes = require("./routes/categoriesRoute");
const subcategoryRoutes = require("./routes/SubCategoriesRoute");
const subSubCategories = require("./routes/subSubCategoriesRoute");
const productRoutes = require("./routes/ProductRoutes");
const dimsGridRoutes = require("./routes/dimsGridRoute");
const dimsFinRoutes = require("./routes/dimsFinRoute");
const dimsColorRoutes = require("./routes/dimsColorRoute");
const dimsTamperRoute = require("./routes/dimsTamperRoute");
const dimsInstRoute = require("./routes/dimsInstRoute");
const dimsLockRoute = require("./routes/dimsLockRoute");
const dimsGTypeRoute = require("./routes/dimsGTypeRoute");
const dimsPSpacingRoute = require("./routes/dimsPSpacingRoute");
const dimsSWinOpensRoute = require("./routes/dimsSWinOpensRoute");
const dimsWHroutes = require("./routes/dimsWHroutes");
const AllgetDimsRoutes = require("./routes/AllgetDimsRoutes");
const ProductImgRoutes = require("./routes/ProductImgRoutes");
const CustMngRoutes = require("./routes/CustMngRoutes");
const productFormula = require("./routes/prodcutFormulaRoutes");
const orderRoutes = require("./routes/orderRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const WishlistRoutes = require("./routes/WishlistRoutes");
const GMCardsRoutes = require("./routes/GMCardsRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const getAllCustData = require("./routes/FinalOrderRoutes");
const searchRoutes = require("./routes/searchRoutes");
const DimDoorRoutes = require("./routes/DimDoorRoutes");


app.use("/api", adminUserManageRoutes);
app.use("/api/appointments", AppointmentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategory", subcategoryRoutes);
app.use("/api/subSubCategories", subSubCategories);
app.use("/api/Products", productRoutes);
app.use("/api/dimsGrid", dimsGridRoutes);
app.use("/api/dimsFin", dimsFinRoutes);
app.use("/api/dimsColor", dimsColorRoutes);
app.use("/api/dimsTamper", dimsTamperRoute);
app.use("/api/dimsInst", dimsInstRoute);
app.use("/api/dimsLock", dimsLockRoute);
app.use("/api/dimsGType", dimsGTypeRoute);
app.use("/api/dimsPSpacing", dimsPSpacingRoute);
app.use("/api/dimsSWinOpens", dimsSWinOpensRoute);
app.use("/api/dimsWH", dimsWHroutes);
app.use("/api/dims", AllgetDimsRoutes);
app.use("/api/ProductImg", ProductImgRoutes);
app.use("/api/CustMng", CustMngRoutes);
app.use("/api/prodFormula", productFormula);
app.use("/api/order", orderRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/wishlist", WishlistRoutes);
app.use("/api/GMCards", GMCardsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/FnalCustData", getAllCustData);
app.use("/api/search", searchRoutes);
app.use("/api/DimDoor", DimDoorRoutes);


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
