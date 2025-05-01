
import { useState } from 'react';
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
    
    const newPhotos: Photo[] = [];
    
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = () => {
        const aspectRatio = img.width > img.height ? "landscape" : "portrait";
        
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

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" />
            Назад
          </Button>
          <h1 className="text-3xl font-bold">{album.title}</h1>
        </div>
        <Button onClick={addPhoto}>
          <Icon name="Plus" />
          Добавить фото
        </Button>
      </div>

      {album.photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
          <Icon name="Camera" size={64} className="text-gray-300 mb-4" />
          <p className="text-gray-500 mb-6">В этом альбоме пока нет фотографий</p>
          <Button onClick={addPhoto}>
            <Icon name="Plus" />
            Добавить фото
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {album.photos.map(photo => (
            <div key={photo.id} className="relative group">
              <img 
                src={photo.url} 
                alt={photo.title} 
                className="w-full aspect-square object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deletePhoto(photo.id)}
                >
                  <Icon name="Trash2" />
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
