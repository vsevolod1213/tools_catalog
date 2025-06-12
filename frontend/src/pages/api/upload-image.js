import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const form = new formidable.IncomingForm({ keepExtensions: true, multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Parse error' });

    const file = files.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = file.filepath || file.path;
    const fileName = `${Date.now()}-${file.originalFilename}`;

    console.log('Uploading:', fileName);

    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, fs.createReadStream(filePath), {
        contentType: file.mimetype,
      });

    if (error) return res.status(500).json({ error: error.message });

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${fileName}`;
    return res.status(200).json({ url: publicUrl });
  });
}
