import { connectDatabase, insertDocument } from '@/helpers/db-util'

async function handler(req, res) {
    const client = await connectDatabase()

    if (req.method === 'POST') {
        try {
            await insertDocument(client, 'blogs', req.body)
            res.status(200).json({ status: 'ok', msg: 'blog inserted successfully' })
            await client.close()
        } catch (error) {
            res.status(500).json({ msg: 'blog insertion failed' })
            await client.close()
            throw new Error('Blog insertion falied')
        }

    }
}

export default handler
