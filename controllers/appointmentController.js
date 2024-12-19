const Appointment = require('../models/appointmentModel');

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
    try{
        const { id } = req.params;
        const appointmentData = await Appointment.findById(id);
        res.status(200).json({
            statusCode: 200,
            status: "success",
            data: appointmentData
        })
    }catch(error){
        console.error(error);
    }
}

const deleteAppointment = async (req, res) => {
    try{
        const { id } = req.params;
        const details = await Appointment.findByIdAndDelete(id);
        res.status(200).json({
            statusCode: 200,
            status: "success",
            data: details
        });
    }catch(error){
        console.error(error);
    }
}

module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentsById,
    deleteAppointment
}