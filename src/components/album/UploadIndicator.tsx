
import Icon from "@/components/ui/icon";

interface UploadIndicatorProps {
  isUploading: boolean;
}

const UploadIndicator = ({ isUploading }: UploadIndicatorProps) => {
  if (!isUploading) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-md p-3 flex items-center gap-2 z-50">
      <Icon name="Loader2" className="animate-spin text-primary" />
      <span>Загрузка фотографий...</span>
    </div>
  );
};

export default UploadIndicator;
