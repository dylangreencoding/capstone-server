const express = require('express');
const router = express.Router();

// harperDB calls
const addBlogPost = require('../harperDB/create-blog-post')
const getBlogPosts = require('../harperDB/get-blog-posts')

// handle create blog post requests
router.post('/create-post', async (request, response) => {
  console.log('trying to create blog post')
  try {
    // destructure client request
    const { blogPost } = request.body;

    // add to db
    await addBlogPost(blogPost);

    // send response
    return response.status(200).json({
      message: 'capstone-server-blog/create-post: "Blog post created successfully"',
      type: 'success',
    });
  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server-blog/create-post: "Error creating blog post"',
      error,
      data: request.body
    });
  }
});

// handle get blog posts requests
router.get('/get-posts', async (request, response) => {
  console.log('trying to get blog posts');
  try {

    const blogPosts = await getBlogPosts()

    return response.status(200).json({
      message: 'capstone-server-blog/create-post: "Blog post created successfully"',
      type: 'success',
      blogPosts
    });
  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server-blog/get-post: "Error getting blog posts"',
      error,
    });
  }
})

module.exports = router;