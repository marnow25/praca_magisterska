const mongoose = require('mongoose');

var favouriteSchema = new mongoose.Schema({
    login: {
        type: String,
    },
    email: {
        type: String,
    },
    filename: {
        type: String,
    },
    caption: {
        type: String,
    },
})



mongoose.model('Favourite', favouriteSchema)