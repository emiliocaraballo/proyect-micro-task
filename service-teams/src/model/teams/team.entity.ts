import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('teams')
export class TeamEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createdAt: Date;

  @Column({ name: 'created_by', type: 'int', select: false })
  createdBy: number;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  updatedAt: Date;

  @Column({ name: 'updated_by', type: 'int', select: false })
  updatedBy: number;
}
