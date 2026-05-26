import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { News } from './news.entity'
import { IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { GcsService } from '../../common/services/gcs.service'

export class CreateNewsDto {
  @ApiProperty() @IsString() title: string
  @ApiProperty() @IsString() slug: string
  @ApiProperty({ required: false }) @IsOptional() @IsString() titleEn?: string
  @ApiProperty({ required: false }) @IsOptional() excerpt?: string
  @ApiProperty({ required: false }) @IsOptional() @IsString() excerptEn?: string
  @ApiProperty({ required: false }) @IsOptional() content?: string
  @ApiProperty({ required: false }) @IsOptional() @IsString() contentEn?: string
  @ApiProperty({ required: false }) @IsOptional() image?: string
  @ApiProperty({ required: false }) @IsOptional() isPublished?: boolean
  @ApiProperty({ required: false, enum: ['news', 'handbook', 'study', 'travel'] }) @IsOptional() type?: 'news' | 'handbook' | 'study' | 'travel'
  @ApiProperty({ required: false }) @IsOptional() country?: string
  @ApiProperty({ required: false }) @IsOptional() registerUrl?: string
  @ApiProperty({ required: false }) @IsOptional() priceFrom?: number
  @ApiProperty({ required: false }) @IsOptional() priceTo?: number
  @ApiProperty({ required: false }) @IsOptional() priceCurrency?: string
  @ApiProperty({ required: false }) @IsOptional() itinerary?: string
  @ApiProperty({ required: false }) @IsOptional() @IsString() itineraryEn?: string
  @ApiProperty({ required: false }) @IsOptional() studyType?: string
}

async function translateText(text: string, from = 'vi', to = 'en'): Promise<string> {
  if (!text) return ''
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    if (data && data[0]) {
      return data[0].map((item: any) => item[0]).join('')
    }
  } catch (error) {
    console.error('Translation error:', error)
  }
  return text
}

async function translateHtml(html: string, from = 'vi', to = 'en'): Promise<string> {
  if (!html) return ''
  try {
    const parts = html.split(/(<[^>]+>)/g)
    const translatedParts = await Promise.all(
      parts.map(async (part) => {
        if (part.startsWith('<') && part.endsWith('>')) {
          return part
        }
        if (part.trim().length === 0) {
          return part
        }
        return await translateText(part, from, to)
      })
    )
    return translatedParts.join('')
  } catch (error) {
    console.error('HTML translation error:', error)
    return html
  }
}

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private newsRepo: Repository<News>,
    private gcsService: GcsService,
  ) {}

  // ── Public ────────────────────────────────────────────────────────────────
  findAll() {
    return this.newsRepo.find({ where: { isPublished: true, type: 'news' }, order: { createdAt: 'DESC' }, take: 20 })
  }

  findAllHandbook() {
    return this.newsRepo.find({ where: { isPublished: true, type: 'handbook' }, order: { createdAt: 'DESC' }, take: 50 })
  }

  findAllStudy(country?: string, studyType?: string) {
    const where: any = { isPublished: true, type: 'study' }
    if (country) where.country = country
    if (studyType) where.studyType = studyType
    return this.newsRepo.find({ where, order: { createdAt: 'DESC' }, take: 100 })
  }

  findAllTravel() {
    return this.newsRepo.find({ where: { isPublished: true, type: 'travel' }, order: { createdAt: 'DESC' }, take: 100 })
  }

  // ── Admin ─────────────────────────────────────────────────────────────────
  findAllAdmin() {
    return this.newsRepo.find({ where: { type: 'news' }, order: { createdAt: 'DESC' } })
  }

  findAllHandbookAdmin() {
    return this.newsRepo.find({ where: { type: 'handbook' }, order: { createdAt: 'DESC' } })
  }

  findAllStudyAdmin() {
    return this.newsRepo.find({ where: { type: 'study' }, order: { createdAt: 'DESC' } })
  }

  findAllTravelAdmin() {
    return this.newsRepo.find({ where: { type: 'travel' }, order: { createdAt: 'DESC' } })
  }

  async findOne(slug: string) {
    const n = await this.newsRepo.findOne({ where: { slug } })
    if (!n) throw new NotFoundException('Không tìm thấy bài viết')
    return n
  }

  async create(dto: CreateNewsDto, file?: Express.Multer.File) {
    const titleEn = dto.titleEn || (await translateText(dto.title))
    const excerptEn = dto.excerptEn || (dto.excerpt ? await translateText(dto.excerpt) : undefined)
    const contentEn = dto.contentEn || (dto.content ? await translateHtml(dto.content) : undefined)
    const itineraryEn = dto.itineraryEn || (dto.itinerary ? await translateText(dto.itinerary) : undefined)

    const n = this.newsRepo.create({
      ...dto,
      titleEn,
      excerptEn,
      contentEn,
      itineraryEn,
      type: dto.type ?? 'news',
      isPublished: this.parseBoolean(dto.isPublished),
    })
    if (file) n.image = await this.saveFile(file, dto.type ?? 'news')
    return this.newsRepo.save(n)
  }

  async update(id: string, dto: Partial<CreateNewsDto>, file?: Express.Multer.File) {
    const n = await this.newsRepo.findOne({ where: { id } })
    if (!n) throw new NotFoundException()

    let titleEn = dto.titleEn
    if (dto.title !== undefined && !titleEn) {
      titleEn = await translateText(dto.title)
    }

    let excerptEn = dto.excerptEn
    if (dto.excerpt !== undefined && !excerptEn) {
      excerptEn = dto.excerpt ? await translateText(dto.excerpt) : ''
    }

    let contentEn = dto.contentEn
    if (dto.content !== undefined && !contentEn) {
      contentEn = dto.content ? await translateHtml(dto.content) : ''
    }

    let itineraryEn = dto.itineraryEn
    if (dto.itinerary !== undefined && !itineraryEn) {
      itineraryEn = dto.itinerary ? await translateText(dto.itinerary) : ''
    }

    Object.assign(n, {
      ...dto,
      ...(titleEn !== undefined ? { titleEn } : {}),
      ...(excerptEn !== undefined ? { excerptEn } : {}),
      ...(contentEn !== undefined ? { contentEn } : {}),
      ...(itineraryEn !== undefined ? { itineraryEn } : {}),
      isPublished: dto.isPublished !== undefined ? this.parseBoolean(dto.isPublished) : n.isPublished,
    })
    if (file) n.image = await this.saveFile(file, n.type)
    return this.newsRepo.save(n)
  }

  async remove(id: string) {
    const n = await this.newsRepo.findOne({ where: { id } })
    if (!n) throw new NotFoundException()
    await this.newsRepo.remove(n)
    return { message: 'Đã xóa bài viết' }
  }

  private parseBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value
    if (typeof value === 'string') return value === 'true' || value === '1'
    return !!value
  }

  private async saveFile(file: Express.Multer.File, type: string): Promise<string> {
    const folder =
      type === 'handbook' ? 'handbook'
      : type === 'study' ? 'study'
      : type === 'travel' ? 'travel'
      : 'news'
    return this.gcsService.uploadFile(file, folder)
  }
}
