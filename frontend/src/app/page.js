import Image from "next/image";

export default function Page() {
  return (
    <div className="relative min-h-screen font-sans">
      {/* Фон на всю страницу */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/banner.png"
          alt="Фон баннера"
          layout="fill"
          objectFit="cover"
          className="brightness-75" // затемним чуть больше для контраста
        />
      </div>

      {/* Хедер */}
      <header className="bg-black/60 text-white shadow">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <nav className="flex space-x-6">
            <a
              href="#"
              className="px-6 py-2 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition-colors text-lg"
            >
              Каталог
            </a>
            <a
              href="#"
              className="px-6 py-2 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition-colors text-lg"
            >
              Услуги
            </a>
          </nav>
          <div className="text-gray-200 font-medium">
            Номер для связи:{" "}
            <span className="text-white font-semibold">89435828578</span>
          </div>
        </div>
      </header>

      {/* Основной блок */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] pt-20 px-6">
        {/* Поле поиска */}
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Поиск товаров"
            className="w-full max-w-md bg-white/40 border border-gray-300 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black shadow-md backdrop-blur-md"
          />
        </div>
      </main>
    </div>
  );
}
