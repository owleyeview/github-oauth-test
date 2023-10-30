//Importing the required modules
const express = require('express')
const cors = require('cors')

//Starting the http server
const app = express()
app.use(cors({ credentials: true, origin: true }))

// View engine
app.set('view engine', 'ejs')

// Routes
const Routes = require('./routes')
app.use('/', Routes)

//Starting the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));