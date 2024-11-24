import { DataSource } from 'typeorm';
import Role from 'src/role/entities/role.entity';

export const seedRoles = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(Role);

  const roles = ['Admin', 'Provider', 'Patient', 'Developer'];

  for (const roleName of roles) {
    const roleExists = await roleRepository.findOne({
      where: { name: roleName },
    });
    if (!roleExists) {
      const role = roleRepository.create({ name: roleName });
      await roleRepository.save(role);
    }
  }

  console.log('Default roles seeded successfully!');
};
