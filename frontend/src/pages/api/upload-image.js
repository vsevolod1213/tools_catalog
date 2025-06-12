import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs';

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
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Ошибка парсинга файла' });

    const file = files.file;
    if (!file) return res.status(400).json({ error: 'Файл не выбран' });

    const filePath = file.filepath;
    const fileName = `${Date.now()}-${file.originalFilename}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, fs.createReadStream(filePath), {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) return res.status(500).json({ error: error.message });

    // Формируем публичный URL. Обычно Supabase предоставляет функцию getPublicUrl,
    // но можно и сформировать вручную:
    const { publicURL, error: urlError } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    if (urlError) return res.status(500).json({ error: urlError.message });

    return res.status(200).json({ url: publicURL });
  });
}
