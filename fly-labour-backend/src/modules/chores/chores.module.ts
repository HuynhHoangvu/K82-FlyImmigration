import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Chore } from './chore.entity'
import { ChoresService } from './chores.service'
import { ChoresController } from './chores.controller'
import { ChoresGateway } from './chores.gateway'

@Module({
  imports: [TypeOrmModule.forFeature([Chore])],
  providers: [ChoresService, ChoresGateway],
  controllers: [ChoresController],
})
export class ChoresModule {}
