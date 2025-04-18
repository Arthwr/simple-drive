export default function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 bytes';

  const base = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.floor(Math.log(bytes) / Math.log(base));

  return (
    parseFloat((bytes / Math.pow(base, index)).toFixed(2)) + ' ' + sizes[index]
  );
}
