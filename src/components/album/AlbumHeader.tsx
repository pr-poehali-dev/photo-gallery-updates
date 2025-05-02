
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

interface AlbumHeaderProps {
  title: string;
  photosCount: number;
  isUploading: boolean;
  onAddPhoto: () => void;
  onDeleteAllPhotos: () => void;
}

const AlbumHeader = ({ 
  title, 
  photosCount, 
  isUploading, 
  onAddPhoto, 
  onDeleteAllPhotos 
}: AlbumHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" className="mr-1" />
            Назад
          </Button>
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={onAddPhoto} disabled={isUploading}>
            <Icon name="Plus" className="mr-1" />
            Добавить фото
          </Button>
          <Button 
            variant="destructive" 
            onClick={onDeleteAllPhotos}
            disabled={photosCount === 0 || isUploading}
          >
            <Icon name="Trash2" className="mr-1" />
            Удалить все
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlbumHeader;
