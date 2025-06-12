import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.log('[upload-image]  Method not allowed');
    return res.status(405).end('Method not allowed');
  }

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('[upload-image]  Form parse error:', err);
      return res.status(500).json({ error: 'Ошибка парсинга формы' });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file || !file.filepath) {
      console.error('[upload-image]  Файл не получен или нет пути:', file);
      return res.status(400).json({ error: 'Файл не получен' });
    }

    try {
      console.log('[upload-image]  File received:', {
        name: file.originalFilename,
        type: file.mimetype,
        path: file.filepath,
      });

      const buffer = await fs.readFile(file.filepath);
      const fileName = `${Date.now()}-${file.originalFilename}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, buffer, {
          contentType: file.mimetype,
        });

      if (uploadError) {
        console.error('[upload-image]  Supabase upload error:', uploadError.message);
        return res.status(500).json({ error: uploadError.message });
      }

      const { data } = supabase.storage.from('images').getPublicUrl(fileName);

      console.log('[upload-image]  File uploaded:', data.publicUrl);
      return res.status(200).json({ url: data.publicUrl });
    } catch (readErr) {
      console.error('[upload-image]  Ошибка чтения файла:', readErr.message);
      return res.status(500).json({ error: 'Ошибка чтения файла: ' + readErr.message });
    }
  });
}