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
          className="brightness-75"
        />
      </div>

      {/* Хедер */}
      <header className="bg-black/60 text-white shadow">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Левое меню */}
          <nav className="flex space-x-6 items-center">
            {/* Каталог с выпадающим меню */}
            <div className="relative group">
              <button className="px-6 py-2 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition-colors text-lg">
                Каталог
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                  Электрический
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                  Бензиновый
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                  Ручной
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                  Аксессуары
                </a>
              </div>
            </div>

            {/* Услуги */}
            <a
              href="#"
              className="px-6 py-2 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition-colors text-lg"
            >
              Услуги
            </a>

            {/* Корзина */}
            <a
              href="#"
              className="px-6 py-2 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition-colors text-lg"
            >
              🛒 Корзина
            </a>
          </nav>

          {/* Номер телефона */}
          <div className="text-gray-200 font-medium">
            Номер для связи:{" "}
            <span className="text-white font-semibold">89435828578</span>
          </div>
        </div>
      </header>

      {/* Основной блок */}
      <main className="flex flex-col items-center justify-start min-h-[calc(100vh-80px)] pt-10 px-6">
        {/* Поле поиска */}
        <div className="w-full max-w-md mb-8">
          <input
            type="text"
            placeholder="Поиск товаров"
            className="w-full max-w-md bg-white/40 border border-gray-300 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black shadow-md backdrop-blur-md"
          />
        </div>

        {/* Каталог товаров */}
        <div className="w-full max-w-screen-xl h-[500px] overflow-y-auto">
          <div className="flex flex-col space-y-4 py-4">
            {/* Пример карточек товаров */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="w-full bg-white/70 rounded-lg shadow-md p-4 backdrop-blur-md"
              >
                <div className="h-40 bg-gray-300 rounded mb-2"></div>
                <h3 className="text-lg font-semibold">Товар {item}</h3>
                <p className="text-sm text-gray-700">Описание товара {item}</p>
                <button className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors">
                  Подробнее
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
