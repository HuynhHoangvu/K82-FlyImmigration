import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'

@Entity('universities')
export class University {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column()
  name: string

  @Column({ nullable: true })
  nameEn: string

  @Column({ nullable: true })
  url: string

  @Column({ type: 'simple-json', nullable: true })
  locations: string[]

  @Column({ nullable: true })
  tuitionFeeRange: string

  @Column({ default: false })
  isGroupOfEight: boolean

  @Index()
  @Column({ default: 'australia' })
  country: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'text', nullable: true })
  descriptionEn: string

  @Column({ nullable: true })
  logo: string

  @Column({ nullable: true })
  image: string

  @Column({ default: false })
  isFeatured: boolean

  @Column({ default: true })
  isActive: boolean

  @Column({ default: 0 })
  viewCount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
