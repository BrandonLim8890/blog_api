var express = require('express')
var router = express.Router()
let postController = require('../controllers/postController')
let commentController = require('../controllers/commentController')
let auth = require('../auth/auth')

/* GET List of posts */
router.get('/', postController.list_get)

// GET post form
router.get('/create', auth.verifyToken, postController.create_get)

// Handle form on POST
router.post('/create', auth.verifyToken, postController.create_post)

// Handle deletion of comment on DELETE
router.delete('/comments/:id', auth.verifyToken, commentController.delete_comment_delete)

// GET post form on update
router.get('/:id/update', auth.verifyToken, postController.update_get)

// Handle update form on PUT
router.put('/:id/update', auth.verifyToken, postController.update_post)

// GET specific POST
router.get('/:id', postController.post_get)

// Handle delete button on post detail on DELETE
router.delete('/:id', auth.verifyToken, postController.post_delete)

// Handle submission of comment on POST
router.post('/:id', commentController.new_comment_post)

module.exports = router
