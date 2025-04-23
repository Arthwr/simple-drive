export default function fixMulterEncoding(str: string): string {
  return Buffer.from(str, 'latin1').toString('utf-8');
}
