import React from 'react';

export const ImagensReaisPage: React.FC = () => {
  // Lista de imagens (substitua com os nomes reais das suas imagens)
  const imageNames = [
    'img1.jpg',
    'img2.jpg',
    'img3.webp',
    'img4.jpg',
    'img5.jpg',
    'img6.webp',
    'img7.avif',
    'img8.jpg',
    'img8.png',
    'img9.webp',
    'img10.jpg',
    'img11.png',
    'img12.jpg',
    'img13.jpg',
    'img15.avif',
    'img16.jpg',
    'img17.webp',
    'img18.jpg',
    'img20.webp',
    'img21.jpeg',
    'img22.jpeg',
  
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Imagens Reais do Manguezal</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {imageNames.map((imageName, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src={`/images/${imageName}`}
              alt={`Imagem real do manguezal ${index + 1}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-700">Manguezal #{index + 1}</h3>
              <p className="text-gray-600 mt-2 text-sm">Uma visão fascinante da vida selvagem e da vegetação única do ecossistema.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};