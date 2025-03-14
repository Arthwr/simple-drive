import { ActionEnum, RoleEnum } from '@prisma/client';

interface RolePermissions {
  role: RoleEnum;
  actions: ReadonlyArray<ActionEnum>;
}

interface StorageLimits {
  role: RoleEnum;
  maxSize: bigint | null;
}

export const rolePermissions: ReadonlyArray<RolePermissions> = [
  {
    role: RoleEnum.GUEST,
    actions: [ActionEnum.READ, ActionEnum.WRITE, ActionEnum.DELETE],
  },
  {
    role: RoleEnum.MEMBER,
    actions: [
      ActionEnum.READ,
      ActionEnum.WRITE,
      ActionEnum.DELETE,
      ActionEnum.SHARE,
    ],
  },
  {
    role: RoleEnum.ADMIN,
    actions: [
      ActionEnum.READ,
      ActionEnum.WRITE,
      ActionEnum.DELETE,
      ActionEnum.SHARE,
    ],
  },
];

export const storageLimits: ReadonlyArray<StorageLimits> = [
  {
    role: RoleEnum.GUEST,
    maxSize: BigInt(100 * 1024 * 1024), // 50 mb
  },
  {
    role: RoleEnum.MEMBER,
    maxSize: BigInt(150 * 1024 * 1024), // 100 mb
  },
  {
    role: RoleEnum.ADMIN,
    maxSize: null, // Unlimited
  },
];
