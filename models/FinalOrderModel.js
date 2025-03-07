// const mongoose = require('mongoose');

// const FinalOrderSchema = new mongoose.Schema({
//     userId: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         required: true, ref: 'User' 
//     },
//     order_id: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         required: true, ref: 'Order' 
//     },
//     orderData: {
//         product_name: { 
//             type: String 
//         },
//         product_sku: { 
//             type: String 
//         },
//         product_price: { 
//             type: Number 
//         },
//         total_price: { 
//             type: Number 
//         },
//         selected_options: { 
//             type: Object 
//         },
//     },
//     status: { 
//         type: String, 
//         required: true 
//     },
//     paymentId: {
//          type: String, 
//          required: true 
//         },
//     quantity: {
//          type: Number, 
//          required: true 
//         },
//     amount: { 
//         type: Number,

//         required: true 
//     },
//     orderStatus: { 
//         type: String, 
//         required: true,
//         default: 'pending'
//     },
//     payment_source: { type: Object },

//     customerDetails: {
//         name: { type: String },
//         email: { type: String },
//         mobile: { type: String },
//         address: { type: String },
//         state: { type: String },
//         zipCode: { type: String },
//         country_name: { type: String },
//     },
// }, { timestamps: true });

// module.exports = mongoose.model('FinalOrder', FinalOrderSchema);




// payer: {
//     name: { type: String },
//     email: { type: String },
//     payer_id: { type: String },
// },

const mongoose = require('mongoose');

const FinalOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, ref: 'User'
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, ref: 'Order'
    },
    orderData: {
        product_name: {
            type: String
        },
        product_sku: {
            type: String
        },
        product_price: {
            type: Number
        },
        total_price: {
            type: Number
        },
        selected_options: {
            type: Object
        },
    },
    status: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'pending'
    },
    payment_source: { type: Object },

    customerDetails: {
        name: { type: String },
        email: { type: String },
        mobile: { type: String },
        address: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country_name: { type: String },
    },

    // Payer information
    payer: {
        card: {
            brand: { type: String },
            number: { type: String }, // assuming card number should be stored
        },
        email: { type: String },
        name: { type: String },
        phone: { type: String }
    },
    
    trackId: {
        type: String,
        required: false
    },
    trackPartner: {
        type: String,
        required: false
    }

}, { timestamps: true });

module.exports = mongoose.model('FinalOrder', FinalOrderSchema);
