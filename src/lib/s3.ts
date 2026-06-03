// src/lib/s3.ts
// AWS S3 helper untuk upload audio & thumbnail

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET!;

// Generate presigned URL untuk upload langsung dari browser ke S3
// (tidak perlu file melewati server kita — efisien)
export async function getPresignedUploadUrl({
  key,
  contentType,
  expiresIn = 60 * 5, // 5 menit
}: {
  key: string;
  contentType: string;
  expiresIn?: number;
}) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn });
  const publicUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { uploadUrl: url, publicUrl };
}

// Hapus file dari S3
export async function deleteS3Object(key: string) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}

// Generate key unik untuk file
export function generateS3Key(
  userId: string,
  type: "audio" | "thumbnail",
  filename: string
) {
  const ext = filename.split(".").pop();
  const timestamp = Date.now();
  return `${type}/${userId}/${timestamp}.${ext}`;
}
