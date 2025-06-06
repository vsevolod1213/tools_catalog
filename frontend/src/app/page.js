import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Хедер */}
      <header className="bg-white shadow">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <nav className="flex space-x-10 mt-6">
            <a
              href="#"
              className="px-10 py-3 bg-orange-600 text-white rounded-full shadow hover:bg-orange-700 transition-colors text-lg"
            >
              Каталог
            </a>
            <a
              href="#"
              className="px-10 py-3 bg-orange-600 text-white rounded-full shadow hover:bg-orange-700 transition-colors text-lg"
            >
              Услуги
            </a>
          </nav>

          <div className="text-gray-600 font-medium">
            Номер для связи:{" "}
            <span className="text-black font-semibold">89435828578</span>
          </div>
        </div>
      </header>

      {/* Поиск товаров */}
      <section className="container mx-auto mt-12 px-6">
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Поиск товаров"
            className="w-full max-w-md border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </section>

      {/* Баннер */}
      <section className="relative w-full min-h-[calc(100vh-80px)] mt-8 flex items-center justify-center">
        <Image
          src="/banner.png"
          alt="Большая картинка"
          layout="fill"
          objectFit="cover"
          className="brightness-90"
        />
        {/* Здесь можно добавить текст поверх баннера, если нужно */}
      </section>
    </div>
  );
}
