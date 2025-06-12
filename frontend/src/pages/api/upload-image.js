import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const uploadDir = path.join(process.cwd(), '/tmp');
const mkdir = promisify(fs.mkdir);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  try {
    await mkdir(uploadDir, { recursive: true });

    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true,
      multiples: false,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: 'Ошибка парсинга формы' });

      const file = files.file;
      if (!file) return res.status(400).json({ error: 'Файл не загружен' });

      const stream = fs.createReadStream(file.path);
      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, stream, {
          contentType: file.type,
          upsert: false,
        });

      if (error) return res.status(500).json({ error: error.message });

      const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${fileName}`;
      return res.status(200).json({ url: publicUrl });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Серверная ошибка при загрузке' });
  }
}
