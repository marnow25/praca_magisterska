const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, (err) => {
    if (!err) { 
        console.log('MonogoDB connection succeded.')
    } else {
        console.log('Error in MongoDB connection: ' + JSON.stringify(err, undefined, 2))
    }
})

require('./user.model')
require('./favourite.model')
 