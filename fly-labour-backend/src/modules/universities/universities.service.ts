import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { University } from './university.entity'

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectRepository(University)
    private readonly universityRepo: Repository<University>,
  ) {}

  async findAll(query?: { country?: string; isFeatured?: boolean; search?: string }) {
    const where: any = { isActive: true }

    if (query?.country) {
      where.country = query.country
    }

    if (query?.isFeatured !== undefined) {
      where.isFeatured = query.isFeatured
    }

    if (query?.search) {
      return this.universityRepo.find({
        where: [
          { ...where, name: Like(`%${query.search}%`) },
          { ...where, nameEn: Like(`%${query.search}%`) },
        ],
        order: { isFeatured: 'DESC', name: 'ASC' },
      })
    }

    return this.universityRepo.find({
      where,
      order: { isFeatured: 'DESC', name: 'ASC' },
    })
  }

  async findOne(id: string) {
    const university = await this.universityRepo.findOne({ where: { id } })
    if (university) {
      // Increment view count
      await this.universityRepo.increment({ id }, 'viewCount', 1)
    }
    return university
  }

  async create(data: Partial<University>) {
    const university = this.universityRepo.create(data)
    return this.universityRepo.save(university)
  }

  async update(id: string, data: Partial<University>) {
    await this.universityRepo.update(id, data)
    return this.findOne(id)
  }

  async remove(id: string) {
    await this.universityRepo.update(id, { isActive: false })
    return { success: true }
  }

  async seedFromJson(data: any[]) {
    let created = 0
    let updated = 0

    for (const item of data) {
      const existing = await this.universityRepo.findOne({
        where: { name: item.name },
      })

      if (existing) {
        // Update existing
        await this.universityRepo.update(existing.id, {
          nameEn: item.name,
          url: item.url,
          locations: item.locations,
          tuitionFeeRange: item.tuition_fee_range_aud,
          isGroupOfEight: item.is_group_of_eight,
          country: 'australia',
          isActive: true,
        })
        updated++
      } else {
        // Create new
        const university = this.universityRepo.create({
          name: item.name,
          nameEn: item.name,
          url: item.url,
          locations: item.locations,
          tuitionFeeRange: item.tuition_fee_range_aud,
          isGroupOfEight: item.is_group_of_eight,
          country: 'australia',
          isActive: true,
        })
        await this.universityRepo.save(university)
        created++
      }
    }
    return { success: true, created, updated, total: data.length }
  }

  async count() {
    return this.universityRepo.count({ where: { isActive: true } })
  }
}
