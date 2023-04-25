// external modules
import { Suspense } from 'react'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { fromUint8Array } from 'js-base64'
import { cookies } from 'next/headers'
import * as jose from 'jose'

// internal modules
import { ReceiptPgql } from '@/common/types/pgql_types'
import { getUsername } from '@/utils/auth'
import { getReceiptByNumberAndUserQuery } from '@/common/queries/getReceiptByNumber'

// components
import Receipt from './receipt'
import Fallback from '@/app/protected/fallback'

const getReceiptImgHref = async (
  username: string,
  receiptNumber: string
): Promise<string> => {
  let receiptSrc = '/undraw_no_photo.svg'

  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.AWS_REGION
  })

  const command = new GetObjectCommand({
    Bucket: 'shoppingify-receipts',
    Key: `${username}/${receiptNumber}.jpg`
  })

  const receiptImage = await s3.send(command)
  if (receiptImage?.Body !== undefined) {
    const byteArray = await receiptImage.Body.transformToByteArray()
    receiptSrc =
      'data:image/jpeg;base64, ' +
      fromUint8Array(byteArray).replace(/.{76}(?=.)/g, '$&\n')
  }
  return receiptSrc
}

const getReceiptData = async (
  username: string,
  receiptNumber: string
): Promise<ReceiptPgql> => {
  const getReceiptByUserAndNumberQuery = getReceiptByNumberAndUserQuery(
    username,
    parseInt(receiptNumber)
  )

  const receipt = await fetch(process.env.PGQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: getReceiptByUserAndNumberQuery
    })
  })
  const data = await receipt.json()
  return data.data.receiptByReceiptNumberAndUser
}

interface Props {
  params: {
    receiptNumber: string
  }
}

export default async function page ({ params }: Props): Promise<JSX.Element> {
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()
  let username = ''

  allCookies.forEach((cookie: { name: string, value: string }) => {
    if (cookie.name.includes('idToken')) {
      username = getUsername(JSON.stringify(jose.decodeJwt(cookie.value)))
    }
  })

  if (username.length > 0) {
    const receiptSrc = await getReceiptImgHref(username, params.receiptNumber)
    const receiptData = await getReceiptData(username, params.receiptNumber)
    return (
      <Suspense fallback={<Fallback />}>
        <Receipt
          imgSrc={`${receiptSrc}`}
          receipt={receiptData}
          initialValue={receiptData}
        />
      </Suspense>
    )
  }

  return <p> Trouble loading receipt. Sorry, try later</p>
}
