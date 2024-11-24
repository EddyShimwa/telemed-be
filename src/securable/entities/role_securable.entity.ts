import Role from 'src/role/entities/role.entity';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Securable } from './securable.entity';

@Entity({ name: 'role_securables' })
export class RoleSecurables extends BaseEntity {
  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @PrimaryColumn()
  role_id: string;

  @PrimaryColumn()
  securable_id: string;

  @ManyToOne(() => Securable, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'securable_id' })
  securable: Securable;
}
