import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { Chore } from './chore.entity'
import { CreateChoreDto, UpdateChoreDto, QueryChoreDto } from './dto/chore.dto'
import { ChoresGateway } from './chores.gateway'

@Injectable()
export class ChoresService {
  constructor(
    @InjectRepository(Chore) private choresRepo: Repository<Chore>,
    private gateway: ChoresGateway,
  ) {}

  async findAll(query: QueryChoreDto) {
    const where: any = {}

    if (query.date) {
      where.date = query.date
    } else if (query.month) {
      // query.month = 'YYYY-MM'
      const [year, month] = query.month.split('-').map(Number)
      const start = new Date(year, month - 1, 1).toISOString().split('T')[0]
      const end   = new Date(year, month, 0).toISOString().split('T')[0]
      where.date  = Between(start, end)
    }

    if (query.assignedToId) where.assignedToId = query.assignedToId

    return this.choresRepo.find({ where, order: { date: 'ASC', createdAt: 'ASC' } })
  }

  async findOne(id: string) {
    const chore = await this.choresRepo.findOne({ where: { id } })
    if (!chore) throw new NotFoundException('Không tìm thấy chore')
    return chore
  }

  async create(dto: CreateChoreDto, userId: string) {
    const chore = this.choresRepo.create({ ...dto, createdById: userId })
    const saved = await this.choresRepo.save(chore)
    this.gateway.emitChoreCreated(saved)
    return saved
  }

  async update(id: string, dto: UpdateChoreDto) {
    const chore = await this.findOne(id)
    Object.assign(chore, dto)
    const saved = await this.choresRepo.save(chore)
    this.gateway.emitChoreUpdated(saved)
    return saved
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.choresRepo.delete(id)
    this.gateway.emitChoreDeleted(id)
    return { success: true }
  }
}
