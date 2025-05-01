
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import AlbumCard from "@/components/AlbumCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Album } from "@/lib/types";

const Index = () => {
  const [albums, setAlbums] = useLocalStorage<Album[]>("albums", []);
  const navigate = useNavigate();

  const createNewAlbum = () => {
    const newAlbum: Album = {
      id: nanoid(),
      title: "new",
      photos: [],
      createdAt: Date.now()
    };
    setAlbums([...albums, newAlbum]);
  };

  const deleteAllAlbums = () => {
    setAlbums([]);
  };

  const deleteAlbum = (id: string) => {
    setAlbums(albums.filter(album => album.id !== id));
  };

  const editAlbum = (id: string, newTitle: string) => {
    setAlbums(albums.map(album => 
      album.id === id ? { ...album, title: newTitle } : album
    ));
  };

  const openAlbum = (id: string) => {
    navigate(`/album/${id}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Фотогалерея</h1>
        <div className="flex space-x-4">
          <Button onClick={createNewAlbum} className="flex items-center gap-2">
            <Icon name="Plus" />
            Добавить альбом
          </Button>
          <Button 
            variant="destructive"
            onClick={deleteAllAlbums}
            disabled={albums.length === 0}
          >
            <Icon name="Trash2" />
            Удалить все альбомы
          </Button>
        </div>
      </div>

      {albums.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
          <Icon name="Images" size={64} className="text-gray-300 mb-4" />
          <p className="text-gray-500 mb-6">У вас пока нет альбомов</p>
          <Button onClick={createNewAlbum}>
            <Icon name="Plus" />
            Добавить альбом
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.map(album => (
            <AlbumCard
              key={album.id}
              album={album}
              onDelete={deleteAlbum}
              onEdit={editAlbum}
              onClick={openAlbum}
            />
          ))}
          <Button 
            variant="outline" 
            className="h-full min-h-[240px] border-dashed flex flex-col items-center justify-center gap-2"
            onClick={createNewAlbum}
          >
            <Icon name="Plus" size={32} className="text-gray-400" />
            <span className="text-gray-500">Добавить альбом</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
