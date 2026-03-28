import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, Request,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { ChoresService } from './chores.service'
import { CreateChoreDto, UpdateChoreDto, QueryChoreDto } from './dto/chore.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@ApiTags('🧹 Chores')
@Controller('chores')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class ChoresController {
  constructor(private choresService: ChoresService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách chores (lọc theo ngày hoặc tháng)' })
  findAll(@Query() query: QueryChoreDto) {
    return this.choresService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết một chore' })
  findOne(@Param('id') id: string) {
    return this.choresService.findOne(id)
  }

  @Post()
  @ApiOperation({ summary: 'Tạo chore mới — tự động sync tới tất cả client qua WebSocket' })
  create(@Body() dto: CreateChoreDto, @Request() req: any) {
    return this.choresService.create(dto, req.user.id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật chore — tự động sync tới tất cả client qua WebSocket' })
  update(@Param('id') id: string, @Body() dto: UpdateChoreDto) {
    return this.choresService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa chore — tự động sync tới tất cả client qua WebSocket' })
  remove(@Param('id') id: string) {
    return this.choresService.remove(id)
  }
}
