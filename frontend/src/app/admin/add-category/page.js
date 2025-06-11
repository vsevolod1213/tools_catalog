"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

function AddCategoryPageInner() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminCode, setAdminCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("admin");
    setAdminCode(code);

    if (!code) {
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
      alert("Название категории не может быть пустым.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });

      if (res.ok) {
        alert("Категория успешно добавлена!");
        window.location.href = `/admin/categories?admin=${adminCode}`;
      } else {
        alert("Ошибка при добавлении категории.");
      }
    } catch (error) {
      console.error(error);
      alert("Ошибка при добавлении категории.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Проверка доступа...</div>;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Доступ запрещён.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans">
      {/* Фон */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/banner.png"
          alt="Фон баннера"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
      </div>

      {/* Хедер */}
      <header className="bg-black/60 text-white shadow fixed w-full z-20">
        <div className="container mx-auto flex justify-center items-center py-4 px-6">
          <nav className="flex flex-wrap gap-3 items-center">
            <Link
              href={`/admin/categories?admin=${adminCode}`}
              className="px-6 py-3 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
            >
              🗂️ Управление категориями
            </Link>
            <Link
              href={`/admin/add-product?admin=${adminCode}`}
              className="px-6 py-3 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
            >
              📦 Управление товарами
            </Link>
            <Link
              href={`/admin/requests?admin=${adminCode}`}
              className="px-6 py-3 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
            >
              📑 Прием заявок
            </Link>
          </nav>
        </div>
      </header>

      {/* Основной блок */}
      <main className="pt-40 px-6 container mx-auto">
        <div className="bg-white/70 rounded-lg shadow-md p-6 backdrop-blur-md max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Добавить категорию
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-1"
              >
                Название категории:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded border shadow-sm focus:outline-none focus:ring focus:border-orange-400"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-1"
              >
                Описание:
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded border shadow-sm focus:outline-none focus:ring focus:border-orange-400"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow transition"
                disabled={saving}
              >
                {saving ? "Сохранение..." : "Создать категорию"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function AddCategoryPage() {
  return (
    <Suspense fallback={<div className="p-8">Загрузка страницы...</div>}>
      <AddCategoryPageInner />
    </Suspense>
  );
}
