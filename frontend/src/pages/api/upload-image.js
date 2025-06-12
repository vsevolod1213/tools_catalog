import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', async () => {
    const buffer = Buffer.concat(chunks);
    const fileName = `${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    return res.status(200).json({ url: data.publicUrl });
  });
}