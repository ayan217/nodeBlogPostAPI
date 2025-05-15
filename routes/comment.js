const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const { addComment, getPaginatedComments, deleteComment } = require('../controllers/commentController');

router.get('/', getPaginatedComments);
router.post('/', auth, addComment);
router.delete('/:commentId', auth, deleteComment);

module.exports = router;
