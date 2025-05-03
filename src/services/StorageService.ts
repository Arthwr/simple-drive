import { SupabaseClient } from '@supabase/supabase-js';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

import config from '../config';
import fixMulterEncoding from '../utils/fixMulterEncoding';

export default class StorageService {
  constructor(private supabase: SupabaseClient) {}

  async uploadFile(file: Express.Multer.File, userId: string): Promise<string> {
    const fileExt = path.extname(file.originalname);
    const filePath = `users/${userId}/${uuidv4()}.${fileExt}`;

    const { data, error } = await this.supabase.storage
      .from(config.supabase_bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(
        `Supabase upload failed for ${fixMulterEncoding(file.originalname)}.`,
      );
    }

    return data.path;
  }

  async getFilePublicUrl(uploadedPath: string): Promise<string> {
    const { data } = this.supabase.storage
      .from(config.supabase_bucket)
      .getPublicUrl(uploadedPath, { download: true });

    if (!data || !data.publicUrl) {
      throw new Error(`Failed to get public URL for ${uploadedPath}.`);
    }

    return data.publicUrl;
  }

  async deleteFiles(storagePaths: string[]): Promise<void> {
    if (storagePaths.length === 0) return;

    const { error } = await this.supabase.storage
      .from(config.supabase_bucket)
      .remove(storagePaths);

    if (error) {
      console.error('Supabase delete error:', error);
    }
  }
}
