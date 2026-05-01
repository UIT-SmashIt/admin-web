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

export const formatTimeToNumber = (time?: string | null): number => {
  if (!time) return 0;

  const parts = time.split(':');

  if (parts.length !== 3) return 0;

  const [hours, minutes, seconds] = parts.map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    Number.isNaN(seconds)
  ) {
    return 0;
  }

  return hours + minutes / 60 + seconds / 3600;
};

export const formatNumberToTime = (value?: number | null): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '00:00:00';
  }

  const totalSeconds = Math.round(value * 3600);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return `${hh}:${mm}:${ss}`;
};

export const formatDateToYYYYMMDD = (date?: Date | null): string => {
  if (!date || Number.isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};