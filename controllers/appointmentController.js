const Appointment = require('../models/appointmentModel');
const Transaction = require('../models/FinalOrderModel');

const createAppointment = async (req, res) => {
    try {
        const { fullName, email, mobile, message, date } = req.body;

        if (!fullName || !email || !mobile || !message || !date) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "All fields are required",
            });
        }

        const newAppointment = new Appointment({
            fullName,
            email,
            mobile,
            message,
            date
        })

        const savedAppointment = await newAppointment.save();


        res.status(200).json({
            success: true,
            message: "Appointment Sehcduled successfully",
            data: savedAppointment
        });

    } catch (error) {
        console.error(error);
    }
}

const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json({
            statusCode: 200,
            status: "success",
            data: appointments,
        });
    } catch (error) {
        console.error(error);
    }
}

const getAppointmentsById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointmentData = await Appointment.findById(id);
        res.status(200).json({
            statusCode: 200,
            status: "success",
            data: appointmentData
        })
    } catch (error) {
        console.error(error);
    }
}

const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const details = await Appointment.findByIdAndDelete(id);
        res.status(200).json({
            statusCode: 200,
            status: "success",
            data: details
        });
    } catch (error) {
        console.error(error);
    }
}

const getSalesData = async (req, res) => {
    try {
        let { filter } = req.query;
        let startDate;

        const today = new Date();

        if (filter === '2months') {
            startDate = new Date();
            startDate.setMonth(today.getMonth() - 2);
        } else {
            startDate = new Date();
            startDate.setDate(today.getDate() - 15);
        }

        const salesData = await Transaction.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: today }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSales: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({ success: true, data: salesData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentsById,
    deleteAppointment,
    getSalesData
}
