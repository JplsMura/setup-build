import React from 'react';
import SetupCard from '../components/ui/SetupCard';

// Dummy data com imagens hiper-realistas de hardware Unsplash
const MOCK_SETUPS = [
  { id: 1, title: 'Ultimate Gaming Rig 2024', author: 'BuildMyPC', likes: 1582, comments: 38, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d6?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'Creator Station Pro', author: 'BuildMyPC', likes: 1080, comments: 37, image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'Ultimate Gaming Rig 2024', author: 'BuildMyPC', likes: 2321, comments: 187, image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800' },
  { id: 4, title: 'Deep Learning Titan', author: 'Hammyan', likes: 8, comments: 20, image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800' },
  { id: 5, title: 'Ultimate Gaming Rig 2024', author: 'Altan_tr', likes: 2, comments: 15, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800' },
  { id: 6, title: 'Ultimate Gaming Rig 2024', author: 'Alberataturre', likes: 1, comments: 0, image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800' },
];

export default function CommunityFeed() {
  return (
    <div className="p-6 md:p-8 lg:px-10 max-w-[1600px] mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[22px] sm:text-2xl font-bold text-slate-800">Community Feed</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_SETUPS.map((setup) => (
          <SetupCard
            key={setup.id}
            title={setup.title}
            author={setup.author}
            likes={setup.likes}
            comments={setup.comments}
            image={setup.image}
          />
        ))}
      </div>
    </div>
  );
}
