export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const timeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) return formatDate(date);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return '';
  const diff = Date.now() - new Date(lastSeen);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 5) return 'Last seen recently';
  if (minutes < 60) return `Last seen ${minutes}m ago`;
  if (hours < 24) return `Last seen ${hours}h ago`;
  return `Last seen ${days}d ago`;
};

export const getConditionColor = (condition) => {
  const map = {
    'new': 'text-success',
    'like-new': 'text-primary-400',
    'good': 'text-warning',
    'fair': 'text-accent',
    'poor': 'text-danger',
  };
  return map[condition] || 'text-gray-400';
};

export const conditionLabels = {
  'new': 'Brand New',
  'like-new': 'Like New',
  'good': 'Good',
  'fair': 'Fair',
  'poor': 'Poor',
};

export const categoryLabels = {
  'smartphones': '📱 Smartphones',
  'laptops': '💻 Laptops',
  'tablets': '📟 Tablets',
  'cameras': '📷 Cameras',
  'audio': '🎧 Audio',
  'gaming': '🎮 Gaming',
  'wearables': '⌚ Wearables',
  'accessories': '🔌 Accessories',
  'other': '📦 Other',
};

export const categories = Object.keys(categoryLabels);
export const conditions = Object.keys(conditionLabels);

export const getAvatarUrl = (avatar, name) => {
  if (avatar) return avatar;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00beff&color=04041a&size=128&bold=true`;
};

export const truncate = (str, length = 100) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};