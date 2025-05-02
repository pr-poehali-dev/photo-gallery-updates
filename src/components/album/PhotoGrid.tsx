
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Photo, GridViewMode } from "@/lib/types";

interface PhotoGridProps {
  photos: Photo[];
  gridCols: number;
  gridGap: number;
  viewMode: GridViewMode;
  isUploading: boolean;
  onDeletePhoto: (photoId: string) => void;
  onReorderPhotos: (photos: Photo[]) => void;
}

const PhotoGrid = ({ 
  photos, 
  gridCols, 
  gridGap, 
  viewMode,
  isUploading, 
  onDeletePhoto, 
  onReorderPhotos 
}: PhotoGridProps) => {
  const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(null);
  const masonryContainerRef = useRef<HTMLDivElement>(null);
  
  // Функции для перетаскивания фотографий
  const handleDragStart = (photoId: string) => {
    setDraggedPhotoId(photoId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (dropTargetId: string) => {
    if (!draggedPhotoId || draggedPhotoId === dropTargetId) return;
    
    const draggedIndex = photos.findIndex(p => p.id === draggedPhotoId);
    const dropIndex = photos.findIndex(p => p.id === dropTargetId);
    
    if (draggedIndex === -1 || dropIndex === -1) return;
    
    // Создаем копию массива фотографий
    const updatedPhotos = [...photos];
    
    // Вынимаем элемент из старой позиции
    const [draggedPhoto] = updatedPhotos.splice(draggedIndex, 1);
    
    // Вставляем его в новую позицию
    updatedPhotos.splice(dropIndex, 0, draggedPhoto);
    
    // Обновляем альбом с новым порядком фотографий
    onReorderPhotos(updatedPhotos);
    
    // Сбрасываем состояние перетаскивания
    setDraggedPhotoId(null);
  };

  // Единый компонент фотографии для всех режимов
  const PhotoItem = ({ photo, index }: { photo: Photo, index: number }) => {
    // Определяем классы для разных режимов
    let aspectClass = "";
    
    if (viewMode === "uniform") {
      // В режиме uniform все фото одинакового размера
      aspectClass = "aspect-square";
    } else if (viewMode === "standard") {
      // В стандартном режиме учитываем соотношение сторон
      if (photo.aspectRatio === "landscape") {
        // Ландшафтные фото на два столбца
        aspectClass = `aspect-[3/2] ${index % gridCols < gridCols - 1 ? 'col-span-2' : ''}`;
      } else {
        aspectClass = "aspect-[2/3]";
      }
    }
    
    return (
      <div 
        key={photo.id} 
        className={`relative group 
          ${draggedPhotoId === photo.id ? 'opacity-60' : ''} 
          ${draggedPhotoId && draggedPhotoId !== photo.id ? 'cursor-move' : ''}
          ${viewMode === "standard" && photo.aspectRatio === "landscape" && index % gridCols < gridCols - 1 ? 'col-span-2' : ''}
        `}
        draggable="true"
        onDragStart={() => handleDragStart(photo.id)}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(photo.id)}
      >
        <img 
          src={photo.url} 
          alt={photo.title} 
          className={`w-full h-full object-cover rounded-md ${
            viewMode === "uniform" ? "aspect-square" : 
            viewMode === "masonry" ? "" :
            photo.aspectRatio === "landscape" ? "aspect-[3/2]" : "aspect-[2/3]"
          }`}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-white p-1 text-black text-xs truncate border-t">
          {photo.originalName || photo.title}
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="destructive" 
            size="icon"
            className="h-8 w-8"
            onClick={() => onDeletePhoto(photo.id)}
            disabled={isUploading}
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
        {draggedPhotoId && draggedPhotoId !== photo.id && (
          <div className="absolute inset-0 border-2 border-dashed border-primary rounded-md pointer-events-none"></div>
        )}
      </div>
    );
  };

  // Masonary grid layout
  if (viewMode === "masonry") {
    return (
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4" 
           style={{ columnCount: gridCols, columnGap: `${gridGap * 0.25}rem` }}
           ref={masonryContainerRef}>
        {photos.map((photo, index) => (
          <div key={photo.id} className="mb-4 break-inside-avoid">
            <PhotoItem photo={photo} index={index} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      className="grid gap-2"
      style={{ 
        gridTemplateColumns: `repeat(${viewMode === "standard" ? gridCols * 2 : gridCols}, 1fr)`,
        gap: `${gridGap * 0.25}rem`
      }}
    >
      {photos.map((photo, index) => (
        <PhotoItem key={photo.id} photo={photo} index={index} />
      ))}
    </div>
  );
};

export default PhotoGrid;
