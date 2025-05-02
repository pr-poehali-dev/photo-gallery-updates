
import { useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Album, Photo } from "@/lib/types";
import DropZone from "@/components/DropZone";

const AlbumView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [albums, setAlbums] = useLocalStorage<Album[]>("albums", []);
  const album = albums.find(a => a.id === id);
  const [gridCols, setGridCols] = useState(4);
  const [gridGap, setGridGap] = useState(4);
  const [isUploading, setIsUploading] = useState(false);
  const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!album) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl mb-4">Альбом не найден</h2>
        <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
      </div>
    );
  }

  const processFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    // Создаем временный массив для новых фотографий
    const uploadedPhotos: Photo[] = [];
    let filesProcessed = 0;
    
    // Обрабатываем каждый файл
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = () => {
        // Определяем ориентацию изображения
        const aspectRatio = img.width / img.height > 1 ? "landscape" : "portrait";
        
        // Создаем объект фотографии
        const newPhoto: Photo = {
          id: nanoid(),
          url,
          title: file.name,
          originalName: file.name,
          aspectRatio
        };
        
        // Добавляем в массив новых фотографий
        uploadedPhotos.push(newPhoto);
        filesProcessed++;
        
        // Когда все файлы обработаны, обновляем состояние
        if (filesProcessed === files.length) {
          // Обновляем альбом с новыми фотографиями
          const updatedAlbum = {
            ...album,
            photos: [...album.photos, ...uploadedPhotos]
          };
          
          // Обновляем состояние альбомов
          setAlbums(prevAlbums => 
            prevAlbums.map(a => a.id === id ? updatedAlbum : a)
          );
          
          setIsUploading(false);
        }
      };
      
      // Загружаем изображение для определения размеров
      img.src = url;
    });
    
    // Сбрасываем значение поля ввода файлов
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const addPhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const deletePhoto = (photoId: string) => {
    const updatedPhotos = album.photos.filter(photo => photo.id !== photoId);
    const updatedAlbum = { ...album, photos: updatedPhotos };
    
    setAlbums(albums.map(a => a.id === id ? updatedAlbum : a));
  };

  const deleteAllPhotos = () => {
    const updatedAlbum = { ...album, photos: [] };
    setAlbums(albums.map(a => a.id === id ? updatedAlbum : a));
  };

  // Функции для перетаскивания фотографий
  const handleDragStart = (photoId: string) => {
    setDraggedPhotoId(photoId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (dropTargetId: string) => {
    if (!draggedPhotoId || draggedPhotoId === dropTargetId) return;
    
    const draggedIndex = album.photos.findIndex(p => p.id === draggedPhotoId);
    const dropIndex = album.photos.findIndex(p => p.id === dropTargetId);
    
    if (draggedIndex === -1 || dropIndex === -1) return;
    
    // Создаем копию массива фотографий
    const updatedPhotos = [...album.photos];
    
    // Вынимаем элемент из старой позиции
    const [draggedPhoto] = updatedPhotos.splice(draggedIndex, 1);
    
    // Вставляем его в новую позицию
    updatedPhotos.splice(dropIndex, 0, draggedPhoto);
    
    // Обновляем альбом с новым порядком фотографий
    const updatedAlbum = { ...album, photos: updatedPhotos };
    setAlbums(albums.map(a => a.id === id ? updatedAlbum : a));
    
    // Сбрасываем состояние перетаскивания
    setDraggedPhotoId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        multiple
      />

      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" className="mr-1" />
              Назад
            </Button>
            <h1 className="text-3xl font-bold">{album.title}</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={addPhoto} disabled={isUploading}>
              <Icon name="Plus" className="mr-1" />
              Добавить фото
            </Button>
            <Button 
              variant="destructive" 
              onClick={deleteAllPhotos}
              disabled={album.photos.length === 0 || isUploading}
            >
              <Icon name="Trash2" className="mr-1" />
              Удалить все
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span>Фото в ряд:</span>
            <input
              type="range"
              min="2"
              max="10"
              value={gridCols}
              onChange={(e) => setGridCols(parseInt(e.target.value))}
              className="w-24"
            />
            <span>{gridCols}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Отступы:</span>
            <input
              type="range"
              min="1"
              max="8"
              value={gridGap}
              onChange={(e) => setGridGap(parseInt(e.target.value))}
              className="w-24"
            />
            <span>{gridGap}</span>
          </div>
        </div>
      </div>

      {album.photos.length === 0 ? (
        <DropZone 
          onFilesSelected={processFiles} 
          className="h-64"
        />
      ) : (
        <>
          <DropZone 
            onFilesSelected={processFiles} 
            className="mb-6 h-32"
          />
          
          <div 
            className="grid gap-2"
            style={{ 
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              gap: `${gridGap * 0.25}rem`
            }}
          >
            {album.photos.map(photo => (
              <div 
                key={photo.id} 
                className={`relative group 
                  ${draggedPhotoId === photo.id ? 'opacity-60' : ''} 
                  ${draggedPhotoId && draggedPhotoId !== photo.id ? 'cursor-move' : ''}
                `}
                draggable="true"
                onDragStart={() => handleDragStart(photo.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(photo.id)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className={`w-full object-cover rounded-md ${
                    photo.aspectRatio === "landscape" ? "aspect-[3/2]" : "aspect-[2/3]"
                  }`}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-1 text-white text-xs truncate">
                  {photo.originalName || photo.title}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deletePhoto(photo.id)}
                    disabled={isUploading}
                  >
                    <Icon name="Trash2" className="mr-1" />
                    Удалить
                  </Button>
                </div>
                {draggedPhotoId && draggedPhotoId !== photo.id && (
                  <div className="absolute inset-0 border-2 border-dashed border-primary rounded-md pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      
      {isUploading && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-md p-3 flex items-center gap-2">
          <Icon name="Loader2" className="animate-spin text-primary" />
          <span>Загрузка фотографий...</span>
        </div>
      )}
    </div>
  );
};

export default AlbumView;
