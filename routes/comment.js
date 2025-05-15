const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const { addComment, getComments, deleteComment } = require('../controllers/commentController');

router.get('/', getComments);
router.post('/', auth, addComment);
router.delete('/:commentId', auth, deleteComment);

module.exports = router;
