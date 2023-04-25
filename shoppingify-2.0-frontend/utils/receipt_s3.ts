// ----- external modules ----- //
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand
} from '@aws-sdk/client-s3'
import { getUsernameFromCookies } from './auth'

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
  },
  region: process.env.NEXT_PUBLIC_AWS_REGION
})

export const addReceiptImageToS3 = async (
  receiptNumber: string,
  file: File
): Promise<boolean> => {
  try {
    const username = getUsernameFromCookies()

    const putObjectCommand = new PutObjectCommand({
      Bucket: 'shoppingify-receipts',
      Key: `${username}/${receiptNumber}.jpg`,
      Body: file
    })
    await s3.send(putObjectCommand)
    return true
  } catch (err) {
    return false
  }
}

export const deleteReceiptImageFromS3 = async (
  receiptNumber: string
): Promise<boolean> => {
  try {
    const username = getUsernameFromCookies()

    const deleteOldCopyCommand = new DeleteObjectCommand({
      Bucket: 'shoppingify-receipts',
      Key: `${username}/${receiptNumber}.jpg`
    })
    await s3.send(deleteOldCopyCommand)

    return true
  } catch (err) {
    return false
  }
}

export const updateReceiptTitle = async (
  oldReceiptNumber: number,
  newReceiptNumber: number
): Promise<boolean> => {
  // as there no update object command in S3
  // we first copy object with a new name
  // delete the old object
  try {
    const username = getUsernameFromCookies()

    const createCopyCommand = new CopyObjectCommand({
      Bucket: 'shoppingify-receipts',
      CopySource: encodeURI(
        `shoppingify-receipts/${username}/${oldReceiptNumber}.jpg`
      ),
      Key: `${username}/${newReceiptNumber}.jpg`
    })

    await s3.send(createCopyCommand)

    const deleteOldCopyCommand = new DeleteObjectCommand({
      Bucket: 'shoppingify-receipts',
      Key: `${username}/${oldReceiptNumber}.jpg`
    })
    await s3.send(deleteOldCopyCommand)
    return true
  } catch (err) {
    return false
  }
}
