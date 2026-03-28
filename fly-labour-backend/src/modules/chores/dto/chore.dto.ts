import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ChoreStatus } from '../chore.entity'

export class CreateChoreDto {
  @ApiProperty({ example: 'Dọn phòng khách' })
  @IsString()
  title: string

  @ApiProperty({ required: false })
  @IsString() @IsOptional()
  description?: string

  @ApiProperty({ example: '2026-03-28' })
  @IsDateString()
  date: string

  @ApiProperty({ required: false })
  @IsString() @IsOptional()
  assignedToId?: string

  @ApiProperty({ enum: ChoreStatus, required: false })
  @IsEnum(ChoreStatus) @IsOptional()
  status?: ChoreStatus
}

export class UpdateChoreDto {
  @ApiProperty({ required: false })
  @IsString() @IsOptional()
  title?: string

  @ApiProperty({ required: false })
  @IsString() @IsOptional()
  description?: string

  @ApiProperty({ required: false })
  @IsDateString() @IsOptional()
  date?: string

  @ApiProperty({ required: false })
  @IsString() @IsOptional()
  assignedToId?: string

  @ApiProperty({ enum: ChoreStatus, required: false })
  @IsEnum(ChoreStatus) @IsOptional()
  status?: ChoreStatus
}

export class QueryChoreDto {
  @IsOptional()
  date?: string

  @IsOptional()
  month?: string  // format: 'YYYY-MM'

  @IsOptional()
  assignedToId?: string
}
