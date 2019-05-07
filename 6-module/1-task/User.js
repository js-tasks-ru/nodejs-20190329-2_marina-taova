const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [{
            validator: function(text) {
              return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(text);
            },
            message: 'Не  прошел валидацию',
        }]
    },
    displayName: {
        type: String,
        required: true,
        index: true,
        trim: true,

    },
}, {
    timestamps: true,

});

module.exports = mongoose.model('User', schema);


