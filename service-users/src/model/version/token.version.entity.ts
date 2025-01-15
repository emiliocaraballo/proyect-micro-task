import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('token_versions')
export class TokenVersionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, length: 10 })
  version: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ name: 'created_by', type: 'int' })
  createdBy: number;
}
