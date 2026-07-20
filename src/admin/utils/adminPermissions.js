export function isAdminUser(user) {
  return user?.role === 'admin';
}

export function canManageCategories(user) {
  return isAdminUser(user);
}
