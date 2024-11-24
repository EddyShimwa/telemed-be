import Role from 'src/role/entities/role.entity';
import { Permission } from 'src/role/entities/permission.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    // Clear existing data
    await dataSource.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE;');
    await dataSource.query('TRUNCATE TABLE "roles" RESTART IDENTITY CASCADE;');

    const permissionRepository = dataSource.getRepository(Permission);
    const roleRepository = dataSource.getRepository(Role);
    const roles = ['Admin', 'Provider', 'Patient', 'Developer'];

    for (const roleName of roles) {
      const existingRole = await roleRepository.findOne({
        where: { name: roleName },
      });
      if (!existingRole) {
        await roleRepository.save(roleRepository.create({ name: roleName }));
      }
    }

    const adminRole = await roleRepository.findOne({
      where: { name: 'Admin' },
    });

    const userRepository = dataSource.getRepository(User);

    const user = userRepository.create({
      name: 'Andrew Semuyaba',
      email: 'samuelsemuyaba@gmail.com',
      registration_key: Math.random().toString(36).substring(2, 15),
      isVerified: true,
      password: 'Password123',
      confirmPassword: 'Password123',
    });

    // Save the new user
    await userRepository.save(user);

    const permission = permissionRepository.create({ role: adminRole, user });
    await permissionRepository.save(permission);

    console.log('Admin user seeded successfully!');
  }
}
