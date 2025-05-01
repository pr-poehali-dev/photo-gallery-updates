
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface DropZoneProps {
  onFilesSelected: (files: FileList | File[]) => void;
  className?: string;
}

const DropZone = ({ onFilesSelected, className = '' }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={`${className} relative flex flex-col items-center justify-center p-8 border-2 ${
        isDragging ? 'border-primary bg-primary/5' : 'border-dashed border-gray-300'
      } rounded-lg transition-colors cursor-pointer`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        accept="image/*"
        multiple
      />
      
      <Icon 
        name="UploadCloud" 
        size={48} 
        className={`mb-3 ${isDragging ? 'text-primary' : 'text-gray-400'}`} 
      />
      
      <p className="mb-2 text-center text-gray-700">
        Перетащите фотографии сюда или
      </p>
      
      <Button type="button" variant="outline" className="mt-2">
        Выберите файлы
      </Button>
      
      <p className="mt-3 text-xs text-gray-500 text-center">
        Поддерживаются: JPG, PNG, GIF, WebP
      </p>
    </div>
  );
};

export default DropZone;
