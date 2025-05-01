
import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Album, Photo } from "@/lib/types";

const AlbumView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [albums, setAlbums] = useLocalStorage<Album[]>("albums", []);
  const album = albums.find(a => a.id === id);
  const [gridCols, setGridCols] = useState(4);
  const [gridGap, setGridGap] = useState(4);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!album) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl mb-4">Альбом не найден</h2>
        <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = () => {
        const aspectRatio = img.width / img.height > 1 ? "landscape" : "portrait";
        
        const newPhoto: Photo = {
          id: nanoid(),
          url,
          title: file.name,
          originalName: file.name,
          aspectRatio
        };
        
        const updatedAlbum = {
          ...album,
          photos: [...album.photos, newPhoto]
        };
        
        setAlbums(albums.map(a => a.id === id ? updatedAlbum : a));
      };
      
      img.src = url;
    });
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
            <Button onClick={addPhoto}>
              <Icon name="Plus" className="mr-1" />
              Добавить фото
            </Button>
            <Button variant="destructive" onClick={deleteAllPhotos}>
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
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
          <Icon name="Camera" size={64} className="text-gray-300 mb-4" />
          <p className="text-gray-500 mb-6">В этом альбоме пока нет фотографий</p>
          <Button onClick={addPhoto}>
            <Icon name="Plus" className="mr-1" />
            Добавить фото
          </Button>
        </div>
      ) : (
        <div 
          className="grid gap-2"
          style={{ 
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            gap: `${gridGap * 0.25}rem`
          }}
        >
          {album.photos.map(photo => (
            <div key={photo.id} className="relative group">
              <img 
                src={photo.url} 
                alt={photo.title} 
                className={`w-full object-cover rounded-md ${
                  photo.aspectRatio === "landscape" ? "aspect-[3/2]" : "aspect-[2/3]"
                }`}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-1 text-white text-xs truncate">
                {photo.originalName}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deletePhoto(photo.id)}
                >
                  <Icon name="Trash2" className="mr-1" />
                  Удалить
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumView;
