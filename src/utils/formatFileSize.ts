export default function formatFileSize(bytes: bigint | number): string {
  if (typeof bytes === 'bigint' && bytes > Number.MAX_SAFE_INTEGER) {
    return `${bytes} bytes`;
  }

  if (bytes === 0 || !bytes) return '';

  const base = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.floor(Math.log(Number(bytes)) / Math.log(base));

  return (
    parseFloat((Number(bytes) / Math.pow(base, index)).toFixed(2)) +
    ' ' +
    sizes[index]
  );
}
