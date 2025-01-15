import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from './task.enum';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ enum: TaskStatus, default: TaskStatus.TO_DO })
  status: TaskStatus;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo: number;

  @Column({ name: 'team_id', nullable: true })
  teamId: number;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: true, select: false })
  createdBy: number;

  @UpdateDateColumn({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
    nullable: true,
  })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true, select: false })
  updatedBy: number;
}
