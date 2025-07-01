import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "PUT") {
    const { name, description, price, image_urls, category_id } = req.body;

    const { error } = await supabase
      .from("products")
      .update({ name, description, price, image_urls, category_id })
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: "Товар обновлён" });
  }

  if (req.method === "DELETE") {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: "Метод не разрешён" });
}
