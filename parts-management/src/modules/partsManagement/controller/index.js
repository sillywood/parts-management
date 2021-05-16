let express = require('express');
let router = express.Router()

const partsRouter = require('./partsManagementController')
const storageRouter = require('./storageController')

router.use('/parts',partsRouter)
router.use('/storage', storageRouter)


module.exports = router