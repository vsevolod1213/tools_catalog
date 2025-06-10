"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Удалить категорию?")) {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        alert("Ошибка удаления");
      }
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Управление категориями</h1>
      <Link
        href="/admin/add-category"
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        ➕ Добавить категорию
      </Link>
      <ul className="mt-4">
        {categories.map((cat) => (
          <li key={cat.id} className="border-b py-2 flex justify-between">
            <span>{cat.name}</span>
            <div className="flex gap-2">
              <Link
                href={`/admin/edit-category/${cat.id}`}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                ✏️ Редактировать
              </Link>
              <button
                onClick={() => handleDelete(cat.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                🗑️ Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
