const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, attributes: ['username'] }],
      order: [['createdAt', 'DESC']]
    });
    console.log(posts)
    res.render('posts/index', { posts });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading posts');
    res.redirect('/');
  }
});

// Show create post form
router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('posts/create');
});

// Create new post
router.post('/create', ensureAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Basic validation
    if (!title || !content) {
      req.flash('error_msg', 'Please fill in all fields');
      return res.redirect('/posts/create');
    }

    await Post.create({
      title,
      content,
      UserId: req.session.user.id
    });

    req.flash('success_msg', 'Post created successfully');
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error creating post');
    res.redirect('/posts/create');
  }
});

// Show single post with comments
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['username'] }]
    });

    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/posts');
    }

    const comments = await Comment.findAll({
      where: { PostId: post.id },
      order: [['createdAt', 'DESC']]
    });

    res.render('posts/show', { post, comments });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading post');
    res.redirect('/posts');
  }
});

// Show edit post form
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/posts');
    }

    // Check post ownership
    if (post.UserId !== req.session.user.id) {
      req.flash('error_msg', 'Not authorized');
      return res.redirect('/posts');
    }

    res.render('posts/edit', { post });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading edit form');
    res.redirect('/posts');
  }
});

// Update post
router.post('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/posts');
    }

    // Check post ownership
    if (post.UserId !== req.session.user.id) {
      req.flash('error_msg', 'Not authorized');
      return res.redirect('/posts');
    }

    const { title, content } = req.body;
    
    // Basic validation
    if (!title || !content) {
      req.flash('error_msg', 'Please fill in all fields');
      return res.redirect(`/posts/${req.params.id}/edit`);
    }

    await post.update({ title, content });
    
    req.flash('success_msg', 'Post updated successfully');
    res.redirect(`/posts/${post.id}`);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error updating post');
    res.redirect('/posts');
  }
});

// Delete post
router.post('/:id/delete', ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/posts');
    }

    // Check post ownership
    if (post.UserId !== req.session.user.id) {
      req.flash('error_msg', 'Not authorized');
      return res.redirect('/posts');
    }

    // Delete associated comments first
    await Comment.destroy({ where: { PostId: post.id } });
    
    // Delete the post
    await post.destroy();
    
    req.flash('success_msg', 'Post deleted successfully');
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error deleting post');
    res.redirect('/posts');
  }
});

// Add comment to post (modified to not require authentication)
router.post('/:id/comments', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/posts');
    }

    const { username, content } = req.body;
    
    if (!username || !content) {
      req.flash('error_msg', 'Username and comment are required');
      return res.redirect(`/posts/${req.params.id}`);
    }

    await Comment.create({
      username,
      content,
      PostId: post.id
    });

    req.flash('success_msg', 'Comment added successfully');
    res.redirect(`/posts/${post.id}`);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error adding comment');
    res.redirect(`/posts/${req.params.id}`);
  }
});

module.exports = router; 