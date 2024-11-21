import Role from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import Password from 'src/utils/password-hash'; // Assuming this is your hashing utility

export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    // Clear existing data
    await dataSource.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE;');
    await dataSource.query('TRUNCATE TABLE "role" RESTART IDENTITY CASCADE;');

    const roleRepository = dataSource.getRepository(Role);
    const roles = ['Admin', 'Provider', 'Patient'];

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
      password: Password.hash('Password123'),
      confirmPassword: Password.hash('Password123'),
    });

    user.role = adminRole;

    // Save the new user
    await userRepository.save(user);

    console.log('Admin user seeded successfully!');
  }
}
