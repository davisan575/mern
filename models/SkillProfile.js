const mongoose = require('mongoose')

const skillProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    licenses: [{
        type: String,
        default: "Unknown"
    }],
    Skills: [{
        type: mongoose.schema.Types.ObjectId,
        default: "N/A",
        ref: 'Skill'

    }]
},
{
    timestamps: true
}
)

module.exports = mongoose.model('SkillProfile', skillProfileSchema)