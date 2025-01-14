
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userManageSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    match: /^[a-zA-Z]+$/,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
  },
  mobile: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  country_name: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  state: {
    type: String,
    required: false
  },
  zipCode: {
    type: String,
    required: false,
    match: [/^\d{5}$/, 'Please enter a valid 5-digit zip code.']
  },
  role: {
    type: String,
    default: 'Super Admin',
  },
  status: {
    type: Number,
    default: 0,
    required: false,
  },
  refresh_token: {
    type: String,
    required: false,
  },
  ins_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  ins_ip: {
    type: String,
    required: false,
    default: null
  },
  ins_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  update_date: {
    type: Date,
    default: null,
  },
  update_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  update_ip: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('AdminUser', userManageSchema);
