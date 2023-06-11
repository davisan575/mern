const express = require('express')
const app = express()
const path = require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const req = require('express/lib/request')
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 3500

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

// telling express where to find static files
// slash optional on 'public', see 'views' below
// app.use(express.static('public))
app.use('/', express.static(path.join(__dirname, '/public'))) 

app.use('/', require('./routes/root'))

app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404: Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    }
}) //everything that reaches this, catch-all

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
