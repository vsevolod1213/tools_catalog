"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

function AddProductPageInner() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminCode, setAdminCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("admin");
    const categoryIdParam = searchParams.get("categoryId");
    setAdminCode(code);
    setCategoryId(categoryIdParam);

    if (!code || !categoryIdParam) {
      setLoading(false);
      setAuthorized(false);
      return;
    }

    fetch(`/api/verify-admin?admin=${code}`)
      .then((res) => res.json())
      .then((data) => {
        setAuthorized(data.access);
        setLoading(false);
      })
      .catch(() => {
        setAuthorized(false);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Название товара не может быть пустым.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, price, image_url: imageUrl, category_id: categoryId })
      });

      if (res.ok) {
        alert("Товар успешно добавлен!");
        window.location.href = `/admin/store/category/${categoryId}?admin=${adminCode}`;
      } else {
        alert("Ошибка при добавлении товара.");
      }
    } catch (error) {
      console.error(error);
      alert("Ошибка при добавлении товара.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Проверка доступа...</div>;

  if (!authorized || !categoryId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Доступ запрещён или не указан ID категории.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans">
      {/* Фон */}
      <div className="absolute inset-0 -z-10">
        <Image src="/banner.png" alt="Фон баннера" fill className="brightness-75" />
      </div>
      <header className="bg-black/60 text-white shadow fixed w-full z-20">
        <div className="container mx-auto flex justify-center items-center py-4 px-6">
          <nav className="flex gap-3 items-center">
            <Link href={`/admin/store?admin=${adminCode}`}>🛒 Управление магазином</Link>
            <Link href={`/admin/requests?admin=${adminCode}`}>📑 Прием заявок</Link>
          </nav>
        </div>
      </header>
      <main className="pt-40 px-6 container mx-auto">
        <div className="bg-white/70 rounded-lg shadow-md p-6 backdrop-blur-md max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Добавить товар</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Название товара" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded border" required />
            <textarea placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded border" />
            <input type="number" placeholder="Цена" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 rounded border" required />
            <input type="text" placeholder="Ссылка на изображение" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-3 py-2 rounded border" />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow transition" disabled={saving}>
              {saving ? "Сохранение..." : "Создать товар"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <Suspense fallback={<div className="p-8">Загрузка страницы...</div>}>
      <AddProductPageInner />
    </Suspense>
  );
}
