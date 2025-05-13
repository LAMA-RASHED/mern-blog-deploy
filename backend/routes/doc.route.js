const router = require('express').Router()

router.get('/json', (req, res)=>{
    res.status(200).json(require('../swagger.json'))
})

const swaggerUi = require('swagger-ui-express')
const swaggerDoc = require('../swagger.json')
router.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc))


const redoc = require('redoc-express')
router.use('/redoc', redoc({specUrl: '/api/documents/json'}))

module.exports = router