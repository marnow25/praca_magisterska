const mongoose = require('mongoose')

const User = mongoose.model('User')

module.exports.register = (req, res, next) => {
    var user = new User()
    user.login = req.body.login
    user.password = req.body.password
    user.email = req.body.email
    user.save((err, doc) => {
        if (!err) {
            res.send(doc)
        } else {
            if(err.code == 11000)
                res.status(422).send(['Duplicate found'])
            else
                return next(err)
        }
    })
}