import { MongoClient } from "mongodb"

export async function connectDatabase() {
    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI)
        return client
    } catch (error) {
        res.status(500).json({ msg: 'connection failed' })
        throw new Error('Connection failed')
    }
}

export async function insertDocument(client, collection, document) {
    const db = client.db()
    await db.collection(collection).insertOne(document)
}

export async function findDocument(client, collection, identifier) {
    //identifier is an object e.g {'email':'aman@gmail.com'}
    const db = client.db()
    const doc = await db.collection(collection).findOne(identifier)
    return doc
}

export async function updateDocument(client, collection, identifier, updatedData) {
    const db = client.db()
    const updated = await db.collection(collection).updateOne(identifier, {
        $set: updatedData
    })
}

export async function deleteDocument(client, collection, identifier) {
    const db = client.db()
    await db.collection(collection).deleteOne(identifier)
}



