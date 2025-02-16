const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

// Ex. 4.5
test('all blogs are returned', async () => {
    response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    expect(response.body).toHaveLength(initialBlogs.length)
})

// Ex. 4.6 NOTE: Will NOT pass after authorization is implemented in 4.12
test('addition of a new blog', async () => {
    const newBlog = {
        title: "Test Blog",
        author: "Jarko P",
        url: "http://example.com",
        likes: 10,
    }

    await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})

    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

})


// Ex. 4.7
test('deletion of a blog', async () => {
    const blogToDelete = await Blog.findOne()
    await api.delete(`/api/blogs/${blogToDelete._id}`)
    .expect(204)

    const blogsAtEnd = await Blog.find({})

    expect(blogsAtEnd).toHaveLength(initialBlogs.length-1)
    // We have compared titles here; IDs could be better, but the assignment had a freedom of choice here.
    expect(blogsAtEnd.map(blog => blog.title)).not.toContain(blogToDelete.title)
})


// These can be put into a separate helper module, but it is not required
const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
    },
    {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
    },
    {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
    },
    {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
    }
]


afterAll(async () => {
    mongoose.connection.close()
})

beforeEach(async () => {
    await Blog.deleteMany({})
    const saves = initialBlogs.map(blog => new Blog(blog).save())
    await Promise.all(saves)
})
