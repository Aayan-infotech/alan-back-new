const express = require('express');
const {createAppointment, getAppointments, getAppointmentsById, deleteAppointment} = require('../controllers/appointmentController');
const router = express.Router();

router.post('/create',createAppointment)
router.get('/',getAppointments)
router.get('/getbyid/:id',getAppointmentsById);
router.delete('/delete/:id',deleteAppointment);

module.exports = router;