var mongoose = require("mongoose");


// var RegisterSchema = new mongoose.Schema({
//     firstname: {
//         type: String,
//         required: true,
//         min: 3,
//         max: 24
//     },

//     lastname: {
//         type: String,
//         required: true,
//         min: 3,
//         max: 24
//     },

//     phone: {
//         type: Number,
//         required: true,
//         min: 10000000000,
//         max: 99999999999
//     },
//     gender:{
//         type: String,
        
//     }

    
// });

// var RegisterSchema = new mongoose.Schema({
//     firstname: String,
//     lastname: String,
//     phone: Number,
//     gender:String,
//     location:String,
//     location_other:String,
//     bus_stop:String,
//     pickupTime:Number,
//     comment:String
// });


var RegisterSchema = new mongoose.Schema({
    firstname: {
        type : String,
        required : true
    },
    lastname: {
        type : String,
        required : true
    },
    phone: {
        type : Number,
        required : true
    },
    gender: {
        type : String,
        required : true
    },
    location: String,
        
    
    // location_other: {
    //     type : String,
    //     required : true
    // },
    location_other: String,
    bus_stop: {
        type : String,
        required : true
    },
    pickupTime: {
        type : Number,
        required : true
    },
    comment: String
        
        
   
});


module.exports = mongoose.model("Register", RegisterSchema);