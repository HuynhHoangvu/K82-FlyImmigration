import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common'
import { UniversitiesService } from './universities.service'
import { University } from './university.entity'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminGuard } from '../../common/guards/admin.guard'

@Controller('universities')
export class UniversitiesController {
  constructor(private readonly service: UniversitiesService) {}

  @Get()
  findAll(@Query() query: { country?: string; isFeatured?: boolean; search?: string }) {
    return this.service.findAll(query)
  }

  @Get('count')
  count() {
    return this.service.count()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() data: Partial<University>) {
    return this.service.create(data)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() data: Partial<University>) {
    return this.service.update(id, data)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
