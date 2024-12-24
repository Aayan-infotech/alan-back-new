const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const uploadDir = require("path").join(__dirname, "uploads");
const fs = require("fs");
const session = require("express-session");
const fileUpload = require('express-fileupload');

dotenv.config();

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));

app.use(express.json()); 
app.use(fileUpload());  
app.use('/uploads', express.static('uploads'));

app.use(cors());
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
const adminUserManageRoutes = require("./routes/adminUserManageRoutes")
const categoryRoutes  = require("./routes/categoriesRoute")
const subcategoryRoutes  = require("./routes/SubCategoriesRoute")
const subSubCategories  = require("./routes/subSubCategoriesRoute")
const productRoutes = require("./routes/ProductRoutes")


app.use('/api', adminUserManageRoutes);
app.use("/api/appointments", AppointmentRoutes);
app.use('/api/categories', categoryRoutes );
app.use('/api/subcategory', subcategoryRoutes );
app.use('/api/subSubCategories', subSubCategories );
app.use('/api/Products', productRoutes );


// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});