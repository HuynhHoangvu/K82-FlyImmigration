import { Injectable, Logger } from '@nestjs/common'
import { Storage } from '@google-cloud/storage'
import { extname } from 'path'
import { randomUUID } from 'crypto'

@Injectable()
export class GcsService {
  private storage: Storage
  private bucketName: string
  private readonly logger = new Logger(GcsService.name)

  constructor() {
    this.bucketName = process.env.GCS_BUCKET_NAME || ''

    const keyJson = process.env.GCS_KEY_JSON
    if (keyJson) {
      try {
        const credentials = JSON.parse(keyJson)
        this.storage = new Storage({ credentials })
      } catch {
        this.logger.error('GCS_KEY_JSON không hợp lệ, không thể parse JSON')
        this.storage = new Storage()
      }
    } else {
      // Local: dùng Application Default Credentials
      this.storage = new Storage()
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    if (!this.bucketName) {
      throw new Error('GCS_BUCKET_NAME chưa được cấu hình')
    }

    const ext = extname(file.originalname).toLowerCase()
    const filename = `${folder}/${randomUUID()}${ext}`

    try {
      const bucket = this.storage.bucket(this.bucketName)
      const fileRef = bucket.file(filename)

      await fileRef.save(file.buffer, {
        metadata: { contentType: file.mimetype },
        // Không dùng public: true vì bucket dùng Uniform access control
        // File public/private được quản lý qua IAM của bucket (allUsers = Storage Object Viewer)
      })

      const url = `https://storage.googleapis.com/${this.bucketName}/${filename}`
      this.logger.log(`Uploaded: ${url}`)
      return url
    } catch (err: any) {
      this.logger.error(`GCS upload thất bại: ${err?.message || err}`)
      throw err
    }
  }
}
