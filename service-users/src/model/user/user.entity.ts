import { Role } from 'service-commons/dist';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ enum: Role, default: Role.member })
  rol: Role.admin | Role.member | Role.viewer;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true, name: 'refresh_token', select: false })
  refreshToken: string;

  @Column({ unique: true, nullable: true, length: 10, name: 'token_version' })
  tokenVersion: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ name: 'created_by', type: 'int' })
  createdBy: number;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ name: 'updated_by', type: 'int' })
  updatedBy: number;
}
