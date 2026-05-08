
'use client';

import { X } from 'lucide-react';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-sm bg-background/95 border-gold/30 shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-gold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
