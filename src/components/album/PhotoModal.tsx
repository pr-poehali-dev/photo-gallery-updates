
import { useEffect, useCallback, useState } from 'react';
import { Photo } from "@/lib/types";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

interface PhotoModalProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const PhotoModal = ({ 
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate
}: PhotoModalProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onNavigate(currentIndex > 0 ? currentIndex - 1 : photos.length - 1);
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onNavigate(currentIndex < photos.length - 1 ? currentIndex + 1 : 0);
  }, [currentIndex, photos.length, onNavigate]);

  // Обработка нажатий клавиш для навигации
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handlePrevious, handleNext, onClose]);

  // Сбрасываем состояние загрузки при изменении индекса
  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);

  if (!isOpen) return null;

  const currentPhoto = photos[currentIndex];
  if (!currentPhoto) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white bg-black/40 p-2 rounded-full hover:bg-black/60 transition-colors"
        >
          <Icon name="X" size={24} />
        </button>

        {/* Основное изображение */}
        <div className="relative max-w-full max-h-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name="Loader2" className="animate-spin text-white" size={32} />
            </div>
          )}
          <img 
            src={currentPhoto.url} 
            alt={currentPhoto.title} 
            className="max-w-full max-h-[90vh] object-contain"
            onLoad={() => setIsLoading(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center">
            {currentPhoto.originalName || currentPhoto.title}
          </div>
        </div>

        {/* Навигационные кнопки */}
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute left-4 text-white bg-black/20 hover:bg-black/40 rounded-full p-2"
          onClick={handlePrevious}
        >
          <Icon name="ChevronLeft" size={32} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute right-4 text-white bg-black/20 hover:bg-black/40 rounded-full p-2"
          onClick={handleNext}
        >
          <Icon name="ChevronRight" size={32} />
        </Button>

        {/* Индикатор прогресса */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
