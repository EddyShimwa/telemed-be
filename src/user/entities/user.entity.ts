import { Exclude } from 'class-transformer';
import Role from 'src/role/entities/role.entity';
import Password from 'src/utils/password-hash';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  otpExpiresAt: Date;

  @Column()
  registration_key: string;

  @Column({ default: false })
  isVerified: boolean;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'permissions',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @Column({ type: 'text' })
  @Exclude()
  password: string;

  @Column({ type: 'text' })
  @Exclude()
  confirmPassword: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  setPassword(password: string) {
    this.password = Password.hash(password || this.password);
  }

  @BeforeInsert()
  setConfirmPassword(confirmPassword: string) {
    this.confirmPassword = Password.hash(
      confirmPassword || this.confirmPassword,
    );
  }
}
