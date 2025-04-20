import formatFileSize from './formatFileSize';

function capitalize(string: string): string {
  if (!string) return '';

  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default { capitalize, formatDate, formatFileSize };
