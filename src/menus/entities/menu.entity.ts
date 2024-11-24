import { Securable } from 'src/securable/entities/securable.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'menus' })
export class MenuEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  icon: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  ordering: number;

  @Column({ nullable: true })
  securable_id: string;

  @Column({ nullable: true })
  parent_id: string;

  @ManyToOne(() => Securable)
  @JoinColumn({ name: 'securable_id' })
  securable: Securable;

  @ManyToOne(() => MenuEntity, (menu) => menu.childMenus, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parentMenu: MenuEntity;

  @OneToMany(() => MenuEntity, (menu) => menu.parentMenu)
  childMenus: MenuEntity[];

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
