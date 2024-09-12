import {Hono}from 'hono'
import { Context } from 'hono'

const blogRouter= new Hono()

blogRouter
.get('/blog' ,(c:Context)=> c.text("hello"))
.post((c:Context)=>c.text("Creating a new blog"))
blogRouter.put('/blog/:id', (c:Context)=>c.text("Updating a blog"))

blogRouter
.get('/blog/:id' ,(c:Context)=> c.text("hello"))


export default blogRouter