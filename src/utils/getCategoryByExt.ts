import { FileExtTypes } from '../config/constants';

const ExtToCategory: Record<string, string> = Object.entries(
  FileExtTypes,
).reduce((acc: Record<string, string>, [category, extensions]) => {
  extensions.forEach((ext) => {
    acc[ext] = category;
  });

  return acc;
}, {});

export default function getCategoryByExt(ext: string): string | undefined {
  return ExtToCategory[ext.toLowerCase()];
}
