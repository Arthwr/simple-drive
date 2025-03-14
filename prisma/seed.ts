import { RoleEnum } from '@prisma/client';

import { rolePermissions, storageLimits } from './config';
import prisma from './config/prismaClient';

async function populateRolesAndPermissions() {
  // Populate initial roles
  const roleRecords = Object.values(RoleEnum).map((role) => ({ name: role }));
  await prisma.role.createMany({
    data: roleRecords,
    skipDuplicates: true,
  });

  console.log('Roles seeded successfully.');

  // Fetch role ID's for mapping : [{ "roleName" : "roleId" }, ...]
  const existingRoles = await prisma.role.findMany();
  const roleIdMap = Object.fromEntries(
    existingRoles.map((role) => [role.name, role.id]),
  );

  // Instert storage limits linked to roles: [{ "roleId", "maxSize" }, ...]
  const storageLimitRecords = storageLimits.map(({ role, maxSize }) => ({
    roleId: roleIdMap[role],
    maxSize,
  }));
  await prisma.storageLimit.createMany({
    data: storageLimitRecords,
    skipDuplicates: true,
  });

  // Insert role permissions
  const rolePermissionRecords = rolePermissions.flatMap(({ role, actions }) =>
    actions.map((action) => ({
      roleId: roleIdMap[role],
      action,
    })),
  );
  await prisma.rolePermission.createMany({
    data: rolePermissionRecords,
    skipDuplicates: true,
  });
}

async function main() {
  await populateRolesAndPermissions();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
