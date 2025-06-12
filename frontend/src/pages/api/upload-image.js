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
  if (req.method !== 'POST') return res.status(405).end();

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Ошибка парсинга формы' });

    const file = files.file;
    if (!file) return res.status(400).json({ error: 'Файл не получен' });

    const filePath = file[0].filepath;
    const fileName = `${Date.now()}-${file[0].originalFilename}`;

    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, fs.createReadStream(filePath), {
        contentType: file[0].mimetype,
      });

    if (error) return res.status(500).json({ error: error.message });

    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    return res.status(200).json({ url: data.publicUrl });
  });
}
