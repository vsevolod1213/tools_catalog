"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AdminPage() {
  const searchParams = useSearchParams();
  const adminCode = searchParams.get("admin");
  const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET;

  if (adminCode !== adminSecret) {
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
              href={`/admin/add-category?admin=${adminSecret}`}
              className="px-6 py-3 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
            >
              🗂️ Управление категориями
            </Link>
            <Link
              href={`/admin/add-product?admin=${adminSecret}`}
              className="px-6 py-3 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
            >
              📦 Управление товарами
            </Link>
            <Link
              href={`/admin/requests?admin=${adminSecret}`}
              className="px-6 py-3 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
            >
              📑 Прием заявок
            </Link>
          </nav>
        </div>
      </header>

      {/* Основной блок */}
      <main className="pt-40 px-6 container mx-auto">
        <div className="bg-white/70 rounded-lg shadow-md p-6 backdrop-blur-md">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Добро пожаловать в админ-панель
          </h1>
          <p className="text-center text-gray-700">
            Выберите действие с помощью кнопок вверху страницы.
          </p>
        </div>
      </main>
    </div>
  );
}
