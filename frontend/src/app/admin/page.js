"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AdminPage() {
  const searchParams = useSearchParams();
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const adminCode = searchParams.get("admin");
    if (adminCode === "sekret123") {
      setAuth(true);
    }
  }, [searchParams]);

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Доступ запрещён. Добавьте ?admin=секретныйкод в URL.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Админ-панель</h1>
      {/* Здесь добавление категорий и товаров */}
      <p>Здесь будет форма для добавления категорий и товаров.</p>
    </div>
  );
}
