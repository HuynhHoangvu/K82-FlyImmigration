import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm'
import { User } from '../users/user.entity'

export enum ChoreStatus {
  PENDING     = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE        = 'done',
}

@Entity('chores')
export class Chore {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'date' })
  date: string

  @Column({ type: 'enum', enum: ChoreStatus, default: ChoreStatus.PENDING })
  status: ChoreStatus

  @ManyToOne(() => User, { nullable: true, eager: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User

  @Column({ nullable: true })
  assignedToId: string

  @ManyToOne(() => User, { nullable: true, eager: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User

  @Column({ nullable: true })
  createdById: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
