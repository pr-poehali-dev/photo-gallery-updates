
import { useState, useRef } from 'react';
import { nanoid } from 'nanoid';
import { Photo } from '@/lib/types';

interface UsePhotoUploadOptions {
  onPhotosProcessed: (photos: Photo[]) => void;
}

export const usePhotoUpload = ({ onPhotosProcessed }: UsePhotoUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        
        // Когда все файлы обработаны, вызываем колбэк
        if (filesProcessed === files.length) {
          onPhotosProcessed(uploadedPhotos);
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

  return {
    isUploading,
    fileInputRef,
    processFiles,
    handleFileChange,
    addPhoto
  };
};
