let express = require('express');
let router = express.Router()

const partsRouter = require('./partsManagementController')

router.use('/parts',partsRouter)



module.exports = router