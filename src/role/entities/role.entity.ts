import { Securable } from 'src/securable/entities/securable.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'roles' })
export default class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ length: 1_000, nullable: true })
  description: string;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToMany(() => Securable, { cascade: true })
  @JoinTable({
    name: 'role_securables',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'securable_id', referencedColumnName: 'id' },
  })
  securables: Securable[];

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: 'permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
