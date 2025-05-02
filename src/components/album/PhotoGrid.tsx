
import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Photo, GridViewMode } from "@/lib/types";
import PhotoModal from "./PhotoModal";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Функции для перетаскивания фотографий
  const handleDragStart = (e: React.DragEvent, photoId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedPhotoId(photoId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e: React.DragEvent, dropTargetId: string) => {
    e.preventDefault();
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

  const handleDragEnd = () => {
    setDraggedPhotoId(null);
  };

  const openPhotoModal = (index: number) => {
    setCurrentPhotoIndex(index);
    setModalOpen(true);
  };

  const closePhotoModal = () => {
    setModalOpen(false);
  };

  const navigatePhoto = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  // Подготовка данных для умной сетки
  const prepareGridItems = useMemo(() => {
    if (viewMode !== "standard") return null;

    // Создаем новый массив с расчетами для grid layout
    let row = 0;
    let colsInCurrentRow = 0;
    const gridItems = [];

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const isLandscape = photo.aspectRatio === "landscape";
      
      // Если это горизонтальное фото
      if (isLandscape) {
        // Если уже есть фото в строке и добавление горизонтального превысит количество столбцов,
        // переходим на новую строку
        if (colsInCurrentRow > 0 && colsInCurrentRow + 2 > gridCols) {
          row++;
          colsInCurrentRow = 0;
        }
        
        // Добавляем горизонтальное фото (занимает 2 колонки)
        gridItems.push({
          photo,
          row,
          col: colsInCurrentRow,
          colSpan: 2,
          index: i
        });
        
        colsInCurrentRow += 2;
      } else {
        // Для вертикального фото (занимает 1 колонку)
        gridItems.push({
          photo,
          row,
          col: colsInCurrentRow,
          colSpan: 1,
          index: i
        });
        
        colsInCurrentRow += 1;
      }
      
      // Если текущая строка заполнена, переходим на следующую
      if (colsInCurrentRow >= gridCols) {
        row++;
        colsInCurrentRow = 0;
      }
    }
    
    return gridItems;
  }, [photos, gridCols, viewMode]);
  
  // Единый компонент фотографии для всех режимов
  const PhotoItem = ({ photo, index }: { photo: Photo, index: number }) => {
    return (
      <div 
        key={photo.id} 
        className={`relative group 
          ${draggedPhotoId === photo.id ? 'opacity-60' : ''} 
          ${draggedPhotoId && draggedPhotoId !== photo.id ? 'cursor-move' : 'cursor-pointer'}
        `}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, photo.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, photo.id)}
        onDragEnd={handleDragEnd}
        onClick={() => openPhotoModal(index)}
      >
        <img 
          src={photo.url} 
          alt={photo.title} 
          className={`w-full rounded-md ${
            viewMode === "uniform" ? "aspect-square object-cover" : 
            "object-contain h-auto"
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
            onClick={(e) => {
              e.stopPropagation();
              onDeletePhoto(photo.id);
            }}
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
      <>
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4" 
             style={{ columnCount: gridCols, columnGap: `${gridGap * 0.25}rem` }}>
          {photos.map((photo, index) => (
            <div key={photo.id} className="mb-4 break-inside-avoid">
              <PhotoItem photo={photo} index={index} />
            </div>
          ))}
        </div>
        
        <PhotoModal
          photos={photos}
          currentIndex={currentPhotoIndex}
          isOpen={modalOpen}
          onClose={closePhotoModal}
          onNavigate={navigatePhoto}
        />
      </>
    );
  }

  // Умная сетка для режима standard
  if (viewMode === "standard" && prepareGridItems) {
    return (
      <>
        <div 
          className="grid"
          style={{ 
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            gap: `${gridGap * 0.25}rem`
          }}
        >
          {prepareGridItems.map((item) => (
            <div 
              key={item.photo.id} 
              style={{ 
                gridColumn: `span ${item.colSpan}`,
                gridRow: `auto`
              }}
            >
              <PhotoItem photo={item.photo} index={item.index} />
            </div>
          ))}
        </div>
        
        <PhotoModal
          photos={photos}
          currentIndex={currentPhotoIndex}
          isOpen={modalOpen}
          onClose={closePhotoModal}
          onNavigate={navigatePhoto}
        />
      </>
    );
  }

  // Uniform grid layout
  return (
    <>
      <div 
        className="grid gap-2"
        style={{ 
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gap: `${gridGap * 0.25}rem`
        }}
      >
        {photos.map((photo, index) => (
          <PhotoItem key={photo.id} photo={photo} index={index} />
        ))}
      </div>
      
      <PhotoModal
        photos={photos}
        currentIndex={currentPhotoIndex}
        isOpen={modalOpen}
        onClose={closePhotoModal}
        onNavigate={navigatePhoto}
      />
    </>
  );
};

export default PhotoGrid;
