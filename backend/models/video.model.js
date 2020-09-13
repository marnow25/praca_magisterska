const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
    caption: {
        required: true,
        type: String,
    },
    filename: {
        required: true,
        type: String,
    },
    fileID: {
        type: Schema.Types.ObjectId,
    }
});

module.exports = Video = mongoose.model('Video', VideoSchema);
