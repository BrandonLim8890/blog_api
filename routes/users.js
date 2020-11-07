var express = require('express')
var router = express.Router()
let user_controller = require('../controllers/userController')

/* GET users listing. */
router.get('/', user_controller.list_get)

// GET request to create new user
router.get('/create', user_controller.create_get)

// POST request to create new user
router.post('/create', user_controller.create_post)

// GET request to update user
router.get('/:id/update', user_controller.update_get)

// PUT request to update user
router.put('/:id/update', user_controller.update_put)

router.get('/:id', user_controller.user_get)

module.exports = router
