/**
 * File: src/lib/constants/activity.ts
 * Constants untuk aktivitas dan sistem gamifikasi
 */

// Kategori aktivitas yang tersedia
export const ActivityCategory = {
  IBADAH: 'IBADAH',
  AKHLAK: 'AKHLAK',
  PEMBELAJARAN: 'PEMBELAJARAN',
  KAJIAN: 'KAJIAN',
  DAKWAH: 'DAKWAH',
  SOSIAL: 'SOSIAL',
  LAINNYA: 'LAINNYA',
} as const;

// Role pengguna dalam sistem
export const UserRole = {
  KOORDINATOR_ANAKREMAS: 'KOORDINATOR_ANAKREMAS',
  ANAK_REMAS: 'ANAK_REMAS',
  MARBOT: 'MARBOT',
  TAKMIR: 'TAKMIR',
  ADMIN: 'ADMIN',
  ORANG_TUA: 'ORANG_TUA',
} as const;

// Status aktivitas
export const ActivityStatus = {
  PENDING: 'PENDING',
  VALIDATED: 'VALIDATED',
  REJECTED: 'REJECTED',
} as const;

// Tipe aktivitas
export const ActivityType = {
  UTAMA: 'UTAMA',
  TAMBAHAN: 'TAMBAHAN',
} as const;

// Kategori user
export const UserCategory = {
  MKIDZ: 'mkidz',
  LAZ: 'laz',
} as const;

// Level user
export const UserLevel = {
  PRAJURIT: 'PRAJURIT',
  SERSAN: 'SERSAN',
  LETNAN: 'LETNAN',
  KAPTEN: 'KAPTEN',
  MAYOR: 'MAYOR',
  KOLONEL: 'KOLONEL',
  JENDERAL: 'JENDERAL',
} as const;

// Trophy yang bisa didapatkan
export const Trophy = {
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  STAR: 'STAR',
} as const;

// Tipe achievement
export const AchievementType = {
  BASIC: 'BASIC',
  COMBO: 'COMBO',
  STREAK: 'STREAK',
  SPECIAL: 'SPECIAL',
} as const;

// Tipe penalty
export const PenaltyType = {
  YELLOW_CARD: 'YELLOW_CARD',
  RED_CARD: 'RED_CARD',
} as const;

// Alasan penolakan aktivitas
export const RejectionReason = {
  TAK_DILAKUKAN: 'TAK_DILAKUKAN',
  TAK_CUKUP_BUKTI: 'TAK_CUKUP_BUKTI',
} as const;

// Type helpers untuk TypeScript
export type ActivityCategoryType = (typeof ActivityCategory)[keyof typeof ActivityCategory];
export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
export type ActivityStatusType = (typeof ActivityStatus)[keyof typeof ActivityStatus];
export type ActivityTypeType = (typeof ActivityType)[keyof typeof ActivityType];
export type UserCategoryType = (typeof UserCategory)[keyof typeof UserCategory];
export type UserLevelType = (typeof UserLevel)[keyof typeof UserLevel];
export type TrophyType = (typeof Trophy)[keyof typeof Trophy];
export type AchievementTypeType = (typeof AchievementType)[keyof typeof AchievementType];
export type PenaltyTypeType = (typeof PenaltyType)[keyof typeof PenaltyType];
export type RejectionReasonType = (typeof RejectionReason)[keyof typeof RejectionReason];
