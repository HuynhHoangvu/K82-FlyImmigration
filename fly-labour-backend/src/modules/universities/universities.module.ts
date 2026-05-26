import { Module, OnModuleInit, Logger } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { University } from './university.entity'
import { UniversitiesService } from './universities.service'
import { UniversitiesController } from './universities.controller'
import * as fs from 'fs'
import * as path from 'path'

@Module({
  imports: [TypeOrmModule.forFeature([University])],
  controllers: [UniversitiesController],
  providers: [UniversitiesService],
  exports: [UniversitiesService],
})
export class UniversitiesModule implements OnModuleInit {
  private readonly logger = new Logger(UniversitiesModule.name)

  constructor(private readonly service: UniversitiesService) {}

  async onModuleInit() {
    this.logger.log('Seeding universities...')
    await this.seedUniversities()
  }

  private async seedUniversities() {
    try {
      const seedPath = path.join(__dirname, '..', '..', '..', 'australian_universities_seed.json')
      if (fs.existsSync(seedPath)) {
        const rawData = fs.readFileSync(seedPath, 'utf-8')
        const data = JSON.parse(rawData)
        const result = await this.service.seedFromJson(data)
        this.logger.log(`Seeded universities: ${result.created} created, ${result.updated} updated`)
      } else {
        this.logger.warn('Seed file not found: australian_universities_seed.json')
      }
    } catch (error) {
      this.logger.error('Failed to seed universities', error)
    }
  }
}
