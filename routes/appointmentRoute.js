const express = require('express');
const {getSalesData,createAppointment, getAppointments, getAppointmentsById, deleteAppointment} = require('../controllers/appointmentController');
const router = express.Router();

router.post('/create',createAppointment)
router.get('/',getAppointments)
router.get('/getbyid/:id',getAppointmentsById);
router.delete('/delete/:id',deleteAppointment);
router.get('/chart',getSalesData);
module.exports = router;