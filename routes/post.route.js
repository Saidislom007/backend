const PostController = require('../controllers/post.controller')
const express = require('express')
const router = express.Router()

router.get('/get-all',PostController.getAll)
router.post('/create',PostController.create)
router.delete('/delete/:id',PostController.delete)
router.delete('/edit/:id',PostController.edit)


module.exports = router