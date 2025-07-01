"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function EditProductPageInner() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const categoryId = searchParams.get("categoryId");
  const adminCode = searchParams.get("admin");

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!productId || !adminCode) {
      setLoading(false);
      setAuthorized(false);
      return;
    }

    fetch(`/api/verify-admin?admin=${adminCode}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.access) throw new Error();
        setAuthorized(true);
        return fetch(`/api/products/${productId}`);
      })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setImageUrls(data.image_urls || []);
        setLoading(false);
      })
      .catch(() => {
        setAuthorized(false);
        setLoading(false);
      });
  }, [productId, adminCode]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok && data.url) {
      setImageUrls((prev) => [...prev, data.url]);
    } else {
      alert("Ошибка загрузки изображения.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        price,
        image_urls: imageUrls,
        category_id: categoryId,
      }),
    });

    if (res.ok) {
      alert("Товар обновлён!");
      window.location.href = `/admin/store/category/${categoryId}?admin=${adminCode}`;
    } else {
      alert("Ошибка при обновлении товара.");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8">Загрузка...</div>;
  if (!authorized)
    return (
      <div className="p-8 text-xl font-bold">
        Доступ запрещён или не указан ID товара.
      </div>
    );

  return (
    <div className="relative min-h-screen font-sans">
      <div className="absolute inset-0 -z-10">
        <Image src="/banner.png" alt="Фон баннера" fill className="brightness-75" />
      </div>
      <header className="bg-black/60 text-white shadow fixed w-full z-20">
        <div className="container mx-auto flex justify-center items-center py-4 px-6">
          <nav className="flex gap-3 items-center">
            <Link href={`/admin/store?admin=${adminCode}`}>🛒 Магазин</Link>
            <Link href={`/admin/requests?admin=${adminCode}`}>📑 Заявки</Link>
          </nav>
        </div>
      </header>
      <main className="pt-40 px-6 container mx-auto">
        <div className="bg-white/70 rounded-lg shadow-md p-6 backdrop-blur-md max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Редактировать товар
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Название товара"
              className="w-full px-3 py-2 rounded border"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание"
              className="w-full px-3 py-2 rounded border"
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Цена"
              className="w-full px-3 py-2 rounded border"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 rounded border bg-white"
            />
            <div className="flex flex-wrap gap-2">
              {imageUrls.map((url, idx) => (
                <Image
                  key={idx}
                  src={url}
                  alt={`img-${idx}`}
                  width={100}
                  height={100}
                  className="rounded border"
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow transition"
            >
              {saving ? "Сохранение..." : "Обновить товар"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<div className="p-8">Загрузка...</div>}>
      <EditProductPageInner />
    </Suspense>
  );
}
