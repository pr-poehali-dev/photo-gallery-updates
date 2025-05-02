
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { GridViewMode } from "@/lib/types";

interface GridControlsProps {
  gridCols: number;
  gridGap: number;
  viewMode: GridViewMode;
  onGridColsChange: (value: number) => void;
  onGridGapChange: (value: number) => void;
  onViewModeChange: (mode: GridViewMode) => void;
}

const GridControls = ({ 
  gridCols, 
  gridGap, 
  viewMode,
  onGridColsChange, 
  onGridGapChange,
  onViewModeChange
}: GridControlsProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-end gap-2 mb-2">
        <Button 
          variant={viewMode === "standard" ? "default" : "outline"} 
          size="icon"
          onClick={() => onViewModeChange("standard")}
          title="Стандартный режим"
        >
          <Icon name="LayoutGrid" size={18} />
        </Button>
        <Button 
          variant={viewMode === "uniform" ? "default" : "outline"} 
          size="icon"
          onClick={() => onViewModeChange("uniform")}
          title="Одинаковый размер"
        >
          <Icon name="Layout" size={18} />
        </Button>
        <Button 
          variant={viewMode === "masonry" ? "default" : "outline"} 
          size="icon"
          onClick={() => onViewModeChange("masonry")}
          title="Плитка"
        >
          <Icon name="Layers" size={18} />
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span>Фото в ряд:</span>
          <input
            type="range"
            min="2"
            max="10"
            value={gridCols}
            onChange={(e) => onGridColsChange(parseInt(e.target.value))}
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
            onChange={(e) => onGridGapChange(parseInt(e.target.value))}
            className="w-24"
          />
          <span>{gridGap}</span>
        </div>
      </div>
    </div>
  );
};

export default GridControls;
