import React from 'react';
import { Heart, MessageSquare } from 'lucide-react';

interface SetupCardProps {
  title: string;
  author: string;
  likes: number;
  comments: number;
  image: string;
}

export default function SetupCard({ title, author, likes, comments, image }: SetupCardProps) {
  return (
    <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-purple-900/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer relative">
      <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-[17px] font-bold text-slate-800 line-clamp-1 mb-2 group-hover:text-[#6532C2] transition-colors">{title}</h3>
        
        <div className="flex items-center gap-2.5 mb-5">
          <img src={`https://ui-avatars.com/api/?name=${author}&background=random&color=fff&bold=true`} alt={author} className="w-6 h-6 rounded-full shadow-sm" />
          <span className="text-sm font-semibold text-slate-500 line-clamp-1">{author}</span>
        </div>
        
        <div className="mt-auto flex flex-col gap-2">
           <div className="flex items-center justify-between gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-purple-50 hover:text-[#6532C2] transition-colors font-semibold text-sm ring-1 ring-inset ring-slate-200 hover:ring-purple-200">
              <Heart className="w-4 h-4" />
              {likes.toLocaleString()}
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors font-semibold text-sm ring-1 ring-inset ring-slate-200">
              <MessageSquare className="w-4 h-4" />
              {comments.toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
