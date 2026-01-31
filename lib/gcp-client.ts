// Google Cloud Platform client configuration

import { Firestore } from "@google-cloud/firestore"
import { Storage } from "@google-cloud/storage"

// Initialize Firestore (GCP's NoSQL database)
let firestoreInstance: Firestore | null = null

export function getFirestoreClient(): Firestore {
  if (firestoreInstance) {
    return firestoreInstance
  }

  const projectId = process.env.GCP_PROJECT_ID
  const credentials = process.env.GCP_SERVICE_ACCOUNT_KEY ? JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY) : undefined

  if (!projectId) {
    throw new Error("Missing GCP_PROJECT_ID environment variable")
  }

  firestoreInstance = new Firestore({
    projectId,
    credentials,
  })

  return firestoreInstance
}

// Initialize Cloud Storage
let storageInstance: Storage | null = null

export function getStorageClient(): Storage {
  if (storageInstance) {
    return storageInstance
  }

  const projectId = process.env.GCP_PROJECT_ID
  const credentials = process.env.GCP_SERVICE_ACCOUNT_KEY ? JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY) : undefined

  if (!projectId) {
    throw new Error("Missing GCP_PROJECT_ID environment variable")
  }

  storageInstance = new Storage({
    projectId,
    credentials,
  })

  return storageInstance
}

// Helper functions for common Firestore operations
export async function getDocument(collection: string, documentId: string) {
  const firestore = getFirestoreClient()
  const docRef = firestore.collection(collection).doc(documentId)
  const doc = await docRef.get()

  if (!doc.exists) {
    return null
  }

  return { id: doc.id, ...doc.data() }
}

export async function queryDocuments(
  collection: string,
  filters?: { field: string; operator: FirebaseFirestore.WhereFilterOp; value: any }[],
  limit?: number,
) {
  const firestore = getFirestoreClient()
  let query: FirebaseFirestore.Query = firestore.collection(collection)

  if (filters) {
    filters.forEach(({ field, operator, value }) => {
      query = query.where(field, operator, value)
    })
  }

  if (limit) {
    query = query.limit(limit)
  }

  const snapshot = await query.get()
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export async function createDocument(collection: string, data: any) {
  const firestore = getFirestoreClient()
  const docRef = await firestore.collection(collection).add({
    ...data,
    created_at: new Date(),
    updated_at: new Date(),
  })
  return { id: docRef.id, ...data }
}

export async function updateDocument(collection: string, documentId: string, data: any) {
  const firestore = getFirestoreClient()
  const docRef = firestore.collection(collection).doc(documentId)
  await docRef.update({
    ...data,
    updated_at: new Date(),
  })
  return { id: documentId, ...data }
}

export async function deleteDocument(collection: string, documentId: string) {
  const firestore = getFirestoreClient()
  await firestore.collection(collection).doc(documentId).delete()
  return { id: documentId }
}
