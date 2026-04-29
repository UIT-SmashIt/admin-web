export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString?: string | null): string => {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};