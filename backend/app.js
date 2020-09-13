const mongoose = require('mongoose')
require('./config/config')
const fs = require('fs')
var dir = './'

// Server connection
const connect = mongoose.createConnection(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (!err) {
        console.log('MonogoDB connection succeded.')
    } else {
        console.log('Error in MongoDB connection: ' + JSON.stringify(err, undefined, 2))
    }
})
connect.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(connect.db, {
        bucketName: "videos"
    })
})

require('./models/user.model')
require('./config/passportConfig')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const rtsIndex = require('./routes/index.router')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage');
const path = require('path')

var app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(passport.initialize())
app.use('/api', rtsIndex)

// Error handler
app.use((err, req, res, next) => {
    if (err.name == 'ValidationError') {
        var valErrors = []
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message))
        res.status(422).send(valErrors)
    }
})

// GridFS Storage configuration
const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    file: (req, file) => {
        console.log(req.body)
        return new Promise((resolve, reject) => {
            const filename = file.originalname
            const splittedTags = req.body.tags.split(',')
            const fileInfo = {
                filename: filename,
                bucketName: 'videos',
                metadata: {
                    caption: req.body.caption,
                    tags: splittedTags,
                    date: req.body.date
                }
            }
            resolve(fileInfo);
        })
    }
})

const upload = multer({ storage });

app.post('/video-upload', upload.single('file'), (req, res, next) => {
})

/* LIST SECTION */

// All files to a list
app.get('/videos-list', (req, res, next) => {
    gfs.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'No files available'
            });
        } else {
            res.status(200).json({
                success: true,
                files: files
            })
        }
    })
})

// Filtering by caption to a list
app.get('/videos-list/:caption', (req, res, next) => {
    gfs.find({
        "metadata.caption": req.params.caption
    })
        .toArray((err, files) => {
            if (!files[0] || files.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No files available',
                });
            } else {
                return res.status(200).json({
                    success: true,
                    files: files,
                })
            }
        })
})

// Filtering by caption and tags to a list
app.get('/videos-list/:caption/:tags', (req, res, next) => {
    const splittedTags = req.params.tags.split('&')
    gfs.find({
        "metadata.caption": req.params.caption,
        "metadata.tags": { $all: splittedTags }
    })
        .toArray((err, files) => {
            if (!files[0] || files.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No files available',
                });
            } else {
                return res.status(200).json({
                    success: true,
                    files: files,
                })
            }
        })
})

// Filtering by caption and date to a list
app.get('/videos-list/:caption/:dateFrom/:dateTill', (req, res, next) => {
    gfs.find({
        "metadata.caption": req.params.caption,
        "metadata.date": {
            $gte: req.params.dateFrom,
            $lt: req.params.dateTill
        }
    })
        .toArray((err, files) => {
            if (!files[0] || files.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No files available',
                });
            } else {
                return res.status(200).json({
                    success: true,
                    files: files,
                })
            }
        })
})

// Filtering by caption, tags and date to list
app.get('/videos-list/:caption/:tags/:dateFrom/:dateTill', (req, res, next) => {
    const splittedTags = req.params.tags.split('&')
    gfs.find({
        "metadata.caption": req.params.caption,
        "metadata.tags": { $all: splittedTags },
        "metadata.date": {
            $gte: req.params.dateFrom,
            $lt: req.params.dateTill
        }
    })
        .toArray((err, files) => {
            if (!files[0] || files.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No files available',
                });
            } else {
                return res.status(200).json({
                    success: true,
                    files: files,
                })
            }
        })
})

/*****************************************************************/

/* DOWNLOAD SECTION */

// Download all files
app.get('/videos-all-download', (req, res, next) => {
    gfs.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'No files available'
            });
        } else {
            for (let [key, value] in Object.entries(files)) {
                if (!fs.existsSync(dir + '/videos/' + files[key].metadata.caption + '/')) {
                    fs.mkdirSync(dir + '/videos/' + files[key].metadata.caption + '/');
                }
                var fs_write_stream = fs.createWriteStream(path.join(dir, '/videos/' + files[key].metadata.caption + '/' + files[key].filename))
                var readstream = gfs.openDownloadStreamByName(files[key].filename)
                readstream.pipe(fs_write_stream)
                fs_write_stream.on('close', function () {
                    console.log('File: ' + files[key].filename + ' downloaded successfully!')
                })
            }
            return res.status(200).json({
                success: true,
                message: 'All successfully downloaded.'
            })
        }
    })
});

// Filtering by caption & download
app.get('/video/:caption', (req, res, next) => {
    gfs.find({
        "metadata.caption": req.params.caption,
    })
        .toArray((err, files) => {
            if (!files[0] || files.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No files available',
                });
            } else {
                for (let [key, value] in Object.entries(files)) {
                    if (!fs.existsSync(dir + '/videos/' + files[key].metadata.caption + '/')) {
                        fs.mkdirSync(dir + '/videos/' + files[key].metadata.caption + '/');
                    }
                    var fs_write_stream = fs.createWriteStream(path.join(dir, '/videos/' + files[key].metadata.caption + '/' + files[key].filename))
                    var readstream = gfs.openDownloadStreamByName(files[key].filename)
                    readstream.pipe(fs_write_stream)
                    fs_write_stream.on('close', function () {
                        console.log('File: ' + files[key].filename + ' downloaded successfully!')
                    })
                }
                return res.status(200).json({
                    success: true,
                    message: 'All successfully downloaded.'
                })
            }
        })
})

// Filtering by caption and tags & download
app.get('/video/:caption/:tags', (req, res, next) => {
    const splittedTags = req.params.tags.split('&')
    gfs.find({
        "metadata.caption": req.params.caption,
        "metadata.tags": { $all: splittedTags }
    })
        .toArray((err, files) => {
            if (!files[0] || files.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No files available',
                });
            } else {
                for (let [key, value] in Object.entries(files)) {
                    if (!fs.existsSync(dir + '/videos/' + files[key].metadata.caption + '/')) {
                        fs.mkdirSync(dir + '/videos/' + files[key].metadata.caption + '/');
                    }
                    var fs_write_stream = fs.createWriteStream(path.join(dir, '/videos/' + files[key].metadata.caption + '/' + files[key].filename))
                    var readstream = gfs.openDownloadStreamByName(files[key].filename)
                    readstream.pipe(fs_write_stream)
                    fs_write_stream.on('close', function () {
                        console.log('File: ' + files[key].filename + ' downloaded successfully!')
                    })
                }
                return res.status(200).json({
                    success: true,
                    message: 'All successfully downloaded.'
                })
            }
        })
})

// Filtering by caption and date & download
app.get('/video/:caption/:dateFrom/:dateTill', (req, res, next) => {
    gfs.find({
        "metadata.caption": req.params.caption,
        "metadata.date": {
            $gte: req.params.dateFrom,
            $lt: req.params.dateTill
        }
    })
        .toArray((err, files) => {
            if (!files[0] || files.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No files available',
                });
            } else {
                for (let [key, value] in Object.entries(files)) {
                    if (!fs.existsSync(dir + '/videos/' + files[key].metadata.caption + '/')) {
                        fs.mkdirSync(dir + '/videos/' + files[key].metadata.caption + '/');
                    }
                    var fs_write_stream = fs.createWriteStream(path.join(dir, '/videos/' + files[key].metadata.caption + '/' + files[key].filename))
                    var readstream = gfs.openDownloadStreamByName(files[key].filename)
                    readstream.pipe(fs_write_stream)
                    fs_write_stream.on('close', function () {
                        console.log('File: ' + files[key].filename + ' downloaded successfully!')
                    })
                }
                return res.status(200).json({
                    success: true,
                    message: 'All successfully downloaded.'
                })
            }
        })
})

// Filtering by caption, tags and date & download
app.get('/video/:caption/:tags/:dateFrom/:dateTill', (req, res, next) => {
    const splittedTags = req.params.tags.split('&')
    gfs.find({
        "metadata.caption": req.params.caption,
        "metadata.tags": { $all: splittedTags },
        "metadata.date": {
            $gte: req.params.dateFrom,
            $lt: req.params.dateTill
        }
    })
        .toArray((err, files) => {
            if (!files[0] || files.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No files available',
                });
            } else {
                for (let [key, value] in Object.entries(files)) {
                    if (!fs.existsSync(dir + '/videos/' + files[key].metadata.caption + '/')) {
                        fs.mkdirSync(dir + '/videos/' + files[key].metadata.caption + '/');
                    }
                    var fs_write_stream = fs.createWriteStream(path.join(dir, '/videos/' + files[key].metadata.caption + '/' + files[key].filename))
                    var readstream = gfs.openDownloadStreamByName(files[key].filename)
                    readstream.pipe(fs_write_stream)
                    fs_write_stream.on('close', function () {
                        console.log('File: ' + files[key].filename + ' downloaded successfully!')
                    })
                }
                return res.status(200).json({
                    success: true,
                    message: 'All successfully downloaded.'
                })
            }
        })
})

/*****************************************************************/

// Start server
app.listen(process.env.PORT, () => console.log('Server started at port: ' + process.env.PORT))
