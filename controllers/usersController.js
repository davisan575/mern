const User = require('../models/User')
const SkillProfile = require('../models/SkillProfile')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler (async (req, res) => {
    // never give password back to the client
    // lean gives data more like json

    // users?.length ----- uses optional chaining to check if users exist before accessing length attribute 
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({message: 'No users found'})
    }
    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const {username, password, roles } = req.body

    // confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message: 'All fields are required'})
    }

    // check for duplicate
    const duplicate = await User.findOne({ username}).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username'})
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // 10 = num of salt rounds

    // don't need to do username username or roles roles since fieldnames the same
    const userObject = { username, "password": hashedPwd, roles}

    // create and store new user
    const user = await User.create(userObject)

    if (user) { // created successful
        res.status(201).json({message: `New user ${username} created`})
    } else {
        res.status(400).json({ message: 'Invalid user data received'})
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body
    
    // confirm data
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active != 'boolean') {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({message: 'User not found'})
    }

    // Check for dupliate
    const duplicate = await User.findOne( {username }).lean().exec()
    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username'})
    }

    // a prop that is not in model would be rejected
    user.username = username
    user.roles = roles
    user.active = active

    if (password ) {
        // Hash password
        user.password = await bcrypt.hash(password, 10) // 10 salt rounds
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated`})

})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID required'})
    }

    const skillProfile = await SkillProfile.findOne({ user: id }).lean().exec()
    if (skillProfile) {
        return res.status(400).json({message: 'User has assigned skill profile'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found'})
    } 

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}