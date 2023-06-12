const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const skillSchema = new mongoose.Schema({
    skillName: {
        type: String,
        required: true,
    },
    skillLevel: {
        type: String,
        required: true
    }
}

)

skillSchema.plugin(AutoIncrement, {
    inc_field: 'count',
    id: 'skillNums',
    start_seq: 1
})

module.exports = mongoose.model('Skill', skillSchema)