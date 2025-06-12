import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, file);

  if (error) {
    console.error('Ошибка загрузки:', error.message);
    alert("Ошибка при загрузке изображения.");
    return;
  }

  const { data: publicUrlData } = supabase
    .storage
    .from('images')
    .getPublicUrl(fileName);

  setImageUrl(publicUrlData.publicUrl);
};
