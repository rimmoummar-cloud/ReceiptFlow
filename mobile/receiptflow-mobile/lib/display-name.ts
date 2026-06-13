import type { User } from '../types';

// export const formatDisplayName = (user: User | null | undefined) => {
//   const name = typeof user?.name === 'string' ? user.name.trim() : '';
//   if (name) {
//     return name;
//   }

//   const email = typeof user?.email === 'string' ? user.email.trim() : '';
//   if (!email) {
//     return 'User';
//   }

//   const localPart = email.split('@')[0]?.trim();
//   return localPart || 'User';
// };
export const formatDisplayName = (user: User | null | undefined) => {
  return (
    user?.name?.trim() ||
    user?.email?.split('@')[0] ||
    user?.email?.trim() ||
    'Account'
  );
};