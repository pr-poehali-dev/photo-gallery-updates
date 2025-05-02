
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Album, Photo, GridViewMode } from "@/lib/types";
import DropZone from "@/components/DropZone";
import { usePhotoUpload } from '@/hooks/usePhotoUpload';
import AlbumHeader from '@/components/album/AlbumHeader';
import GridControls from '@/components/album/GridControls';
import PhotoGrid from '@/components/album/PhotoGrid';
import UploadIndicator from '@/components/album/UploadIndicator';

const AlbumView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [albums, setAlbums] = useLocalStorage<Album[]>("albums", []);
  const album = albums.find(a => a.id === id);
  const [gridCols, setGridCols] = useLocalStorage<number>("photosGridCols", 4);
  const [gridGap, setGridGap] = useLocalStorage<number>("photosGridGap", 4);
  const [viewMode, setViewMode] = useLocalStorage<GridViewMode>("photosViewMode", "standard");

  // Custom hook для загрузки фотографий
  const { 
    isUploading, 
    fileInputRef, 
    processFiles, 
    handleFileChange, 
    addPhoto 
  } = usePhotoUpload({
    onPhotosProcessed: (uploadedPhotos) => {
      if (!album) return;
      
      // Обновляем альбом с новыми фотографиями
      const updatedAlbum = {
        ...album,
        photos: [...album.photos, ...uploadedPhotos]
      };
      
      // Обновляем состояние альбомов
      setAlbums(prevAlbums => 
        prevAlbums.map(a => a.id === id ? updatedAlbum : a)
      );
    }
  });

  // Если альбом не найден
  if (!album) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl mb-4">Альбом не найден</h2>
        <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
      </div>
    );
  }

  // Обработчики для работы с фотографиями
  const deletePhoto = (photoId: string) => {
    const updatedPhotos = album.photos.filter(photo => photo.id !== photoId);
    const updatedAlbum = { ...album, photos: updatedPhotos };
    
    setAlbums(albums.map(a => a.id === id ? updatedAlbum : a));
  };

  const deleteAllPhotos = () => {
    const updatedAlbum = { ...album, photos: [] };
    setAlbums(albums.map(a => a.id === id ? updatedAlbum : a));
  };

  const reorderPhotos = (updatedPhotos: Photo[]) => {
    const updatedAlbum = { ...album, photos: updatedPhotos };
    setAlbums(albums.map(a => a.id === id ? updatedAlbum : a));
  };

  return (
    <div className="container mx-auto p-4">
      {/* Скрытый input для загрузки файлов */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        multiple
      />

      {/* Шапка альбома с кнопками */}
      <AlbumHeader 
        title={album.title} 
        photosCount={album.photos.length}
        isUploading={isUploading}
        onAddPhoto={addPhoto}
        onDeleteAllPhotos={deleteAllPhotos}
      />

      {/* Настройки сетки */}
      <GridControls 
        gridCols={gridCols}
        gridGap={gridGap}
        viewMode={viewMode}
        onGridColsChange={setGridCols}
        onGridGapChange={setGridGap}
        onViewModeChange={setViewMode}
      />

      {/* Основное содержимое: DropZone или сетка фотографий */}
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
          
          <PhotoGrid 
            photos={album.photos}
            gridCols={gridCols}
            gridGap={gridGap}
            viewMode={viewMode}
            isUploading={isUploading}
            onDeletePhoto={deletePhoto}
            onReorderPhotos={reorderPhotos}
          />
        </>
      )}
      
      {/* Индикатор загрузки */}
      <UploadIndicator isUploading={isUploading} />
    </div>
  );
};

export default AlbumView;
