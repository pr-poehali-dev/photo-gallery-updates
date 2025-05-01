
import { Album } from "@/lib/types";
import Icon from "@/components/ui/icon";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface AlbumCardProps {
  album: Album;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onClick: (id: string) => void;
}

const AlbumCard = ({ album, onDelete, onEdit, onClick }: AlbumCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(album.title);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(album.id, title);
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(album.id);
  };

  return (
    <Card 
      className="relative w-full max-w-[240px] cursor-pointer hover:shadow-md transition-shadow group"
      onClick={() => onClick(album.id)}
    >
      <CardContent className="p-4">
        <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden bg-gray-100 rounded-md mb-2">
          {album.photos.length > 0 ? (
            <img 
              src={album.photos[0].url} 
              alt={album.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon name="Camera" size={48} className="text-gray-400" />
          )}
          
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleEditClick}
              className="bg-white p-1 rounded-full shadow-sm hover:bg-gray-100"
            >
              <Icon name="Edit" size={18} />
            </button>
            <button 
              onClick={handleDelete}
              className="bg-white p-1 rounded-full shadow-sm hover:bg-gray-100 text-red-500"
            >
              <Icon name="Trash2" size={18} />
            </button>
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex space-x-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 p-1 text-sm border rounded"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
            <button 
              onClick={handleSave}
              className="bg-primary text-white p-1 rounded"
            >
              <Icon name="Check" size={16} />
            </button>
          </div>
        ) : (
          <div className="font-medium truncate">{album.title}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlbumCard;
