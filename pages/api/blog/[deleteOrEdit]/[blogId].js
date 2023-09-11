

import { connectDatabase,  findDocument, updateDocument, deleteDocument } from '@/helpers/db-util'
import { ObjectId } from 'mongodb'

async function handler(req, res) {
    const client = await connectDatabase()
    const blogId = req.query.blogId

    if (req.method === "DELETE") {
        try {
            const blog = await findDocument(client, 'blogs', { _id: new ObjectId(blogId) })
            if (!blog) {
                res.status(201).json({ status: 'invalid', message: 'Blog not found' })
                await client.close()
                return
            }
        } catch (error) {
            res.status(500).json({ msg: 'some error occured' })
            await client.close()
            throw new Error('some error occured')
        }
        try {
            await deleteDocument(client, 'blogs', { _id: new ObjectId(blogId) })
            res.status(201).json({ status: 'ok', message: 'Blog deleted successfully' })
            await client.close()
        } catch (error) {
            res.status(500).json({ msg: 'blog deletion failed' })
            await client.close()
            throw new Error('Blog deletion falied')
        }
    }

    if (req.method === "PATCH") {
        const client = await connectDatabase()
        const blogId = req.query.blogId
        try {
            const blog = await findDocument(client, 'blogs', { _id: new ObjectId(blogId) })
            if (!blog) {
                res.status(201).json({ status: 'invalid', message: 'Blog not found' })
                await client.close()
                return
            }
        } catch (error) {
            res.status(500).json({ msg: 'some error occured' })
            await client.close()
            throw new Error('some error occured')
        }
        try {
            await updateDocument(client, 'blogs', { _id: new ObjectId(blogId) }, req.body)
            res.status(201).json({ status: 'ok', message: 'Blog updated successfully' })
            await client.close()
        } catch (error) {
            res.status(500).json({ msg: 'blog updation failed' })
            await client.close()
            throw new Error('Blog updation falied')
        }
    }

}

export default handler
