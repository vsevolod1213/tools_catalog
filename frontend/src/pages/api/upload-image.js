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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: false, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('[formidable error]', err);
      return res.status(500).json({ error: 'Ошибка парсинга формы' });
    }

    const fileInput = files.file;
    const file = Array.isArray(fileInput) ? fileInput[0] : fileInput;

    if (!file || !file.path) {
      console.error('[Missing file or path]', file);
      return res.status(400).json({ error: 'Файл не получен или путь отсутствует' });
    }

    try {
      const buffer = await fs.readFile(file.path);

      // 🧼 очищаем имя
      const safeName = file.name.replace(/[^\w.-]/g, '_');
      const fileName = `${Date.now()}-${safeName}`;

      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, buffer, {
          contentType: file.type,
        });

      if (error) {
        console.error('[Supabase upload error]', error);
        return res.status(500).json({ error: error.message });
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      return res.status(200).json({ url: data.publicUrl });
    } catch (e) {
      console.error('[File read error]', e);
      return res.status(500).json({ error: 'Ошибка чтения файла: ' + e.message });
    }
  });
}
