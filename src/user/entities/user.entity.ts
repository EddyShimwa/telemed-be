import { Exclude } from 'class-transformer';
import Role from 'src/role/entities/role.entity';
import Password from 'src/utils/password-hash';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @Column({ nullable: true })
  roleId: string;

  @Column()
  registration_key: string;

  @Column({ default: false })
  isVerified: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

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
