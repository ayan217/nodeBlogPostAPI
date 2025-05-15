Blog API Documentation

1. Clone and run npm i
2. Create .env file following the example of .env.example
3. Run npm run dev

Base URL: http://localhost:5000/api
Authentication: JWT (Bearer Token in Authorization header)
Rate Limit: 100 requests per 15 minutes
Content-Type: application/json
Pagination: ?page=1&limit=10
Tag Filtering: ?tag=tag1,tag2
Search: ?search=keyword

---

Authentication

Register User
- Endpoint: POST /auth/register
- Headers:
  Content-Type: application/json
- Body:
  {
    "username": "ayan",
    "password": "password",
    "email": "karmakarayan217@gmail.com"
  }
- Description: Register a new user.

Login User
- Endpoint: POST /auth/login
- Headers:
  Content-Type: application/json
- Body:
  {
    "username": "ayan",
    "password": "password"
  }
- Description: Login user and receive a JWT token.

---

Blogs

Create Blog
- Endpoint: POST /blogs
- Headers:
  Authorization: Bearer {jwt_token}
  Content-Type: application/json
- Body:
  {
    "title": "Title",
    "content": "Content",
    "tags": ["Tag 1", "Tag 2"]
  }
- Description: Create a new blog post. Requires JWT.

Get Blogs (Paginated, Search, Tags Filter)
- Endpoint: GET /blogs
- Query Parameters:
  page (optional, default=1)
  limit (optional, default=10)
  search (optional) — keyword to search
  tag (optional) — comma-separated tags to filter
- Example: /blogs?page=1&limit=5&search=Title&tag=tag-1,tag-2
- Description: Retrieve blogs with pagination, search, and tag filtering.

Get Single Blog
- Endpoint: GET /blogs/{blogId}
- Headers:
  Authorization: Bearer {jwt_token}
  Content-Type: application/json
- Description: Get a single blog post by ID. Requires JWT.

Update Blog by ID
- Endpoint: PUT /blogs/{blogId}
- Headers:
  Authorization: Bearer {jwt_token}
  Content-Type: application/json
- Body:
  {
    "title": "Title Updated",
    "content": "Content Update",
    "tags": ["Tag 1 Updated", "Tag 2 Updated"]
  }
- Description: Update a blog post by ID. Requires JWT.

Delete Blog by ID
- Endpoint: DELETE /blogs/{blogId}
- Headers:
  Authorization: Bearer {jwt_token}
  Content-Type: application/json
- Description: Delete a blog post by ID. Requires JWT.

---

Comments

Add Comment to a Blog
- Endpoint: POST /blogs/{blogId}/comments
- Headers:
  Authorization: Bearer {jwt_token}
  Content-Type: application/json
- Body:
  {
    "content": "Nice blog! 2"
  }
- Description: Add a comment to a blog post. Requires JWT.

Get Comments for a Blog (Paginated)
- Endpoint: GET /blogs/{blogId}/comments
- Query Parameters:
  page (optional, default=1)
  limit (optional, default=10)
- Example: /blogs/{blogId}/comments?page=1&limit=5
- Description: Retrieve comments for a blog post with pagination.

Delete Comment by Comment ID
- Endpoint: DELETE /blogs/{blogId}/comments/{commentId}
- Headers:
  Authorization: Bearer {jwt_token}
- Description: Delete a comment by comment ID. Requires JWT.

---

Notes
- Replace {blogId}, {commentId}, and {jwt_token} with actual values.
- All protected endpoints require Authorization header with valid JWT.
- Rate limit is 100 requests per 15 minutes per user.
- All request bodies must use application/json.
