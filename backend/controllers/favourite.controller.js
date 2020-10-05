const mongoose = require('mongoose')

const Favourite = mongoose.model('Favourite')

module.exports.saveFavourite = (req, res, next) => {
    var favourite = new Favourite()
    favourite.login = req.body.params.updates[0].value
    favourite.email = req.body.params.updates[1].value
    favourite.filename = req.body.params.updates[2].value
    favourite.caption = req.body.params.updates[3].value
    favourite.save((err, doc) => {
        if (!err) {
            return res.status(200).json({
                file: doc.filename,
                message: 'Added to favourite successfully'
            })
        } else {
            return res.status(200).json({
                error: err,
                message: 'Added to favourite failed'
            })
        }
    })
}

module.exports.getFavouritesList = (req, res, next) => {
    let login = req.body.params.updates[0].value
    let email = req.body.params.updates[1].value
    Favourite.find({ login: login, email: email }, (err, list) => {
        if (!list) {
            return res.status(200).json({
                success: false,
            })
        } else {
            list = prepareData(list)
            return res.status(200).json({
                success: true,
                files: list
            })
        }
    })
}

module.exports.deleteFromFavouritesListDepeningOnUser = (req, res, next) => {
    let login = req.body.params.updates[0].value
    let email = req.body.params.updates[1].value
    let caption = req.body.params.updates[2].value
    let filename = req.body.params.updates[3].value
    Favourite.deleteOne({ login: login, email: email, caption: caption, filename: filename }, (err) => {
        if(!err) { 
            return res.status(200).json({
                success: true,
            })
        } else {
            return res.status(200).json({
                success: false,
            })
        }
    })
}

module.exports.deleteFromFavouritesList = (req, res, next) => {
    let caption = req.body.params.updates[0].value
    let filename = req.body.params.updates[1].value
    Favourite.deleteMany({ caption: caption, filename: filename }, (err) => {
        if(!err) { 
            return res.status(200).json({
                success: true,
            })
        } else {
            return res.status(200).json({
                success: false,
            })
        }
    })
}

function prepareData(files) {
    let videosArray = []
    for (let key in files) {
        videosArray.push({ filename: files[key].filename, caption: files[key].caption })
    }
    return videosArray
}