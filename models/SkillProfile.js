const mongoose = require('mongoose')

const skillProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    licenses: [{
        type: String,
        default: "Unknown"
    }],
    Skills: [{
        type: mongoose.Schema.Types.ObjectId,
        default: "N/A",
        ref: 'Skill'

    }]
},
{
    timestamps: true
}
)

module.exports = mongoose.model('SkillProfile', skillProfileSchema)