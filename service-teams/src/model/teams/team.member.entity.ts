import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TeamEntity } from './team.entity';
import { TeamMemberType } from './role.enum';

@Entity('team_members')
export class TeamMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TeamEntity, (team) => team.id)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column({ name: 'team_id', type: 'int' })
  teamId: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({
    type: 'enum',
    enum: TeamMemberType,
    default: TeamMemberType.MEMBER,
    select: false,
  })
  role: TeamMemberType;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: true, select: false })
  createdBy: number;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true, select: false })
  updatedBy: number;
}
