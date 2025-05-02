
interface GridControlsProps {
  gridCols: number;
  gridGap: number;
  onGridColsChange: (value: number) => void;
  onGridGapChange: (value: number) => void;
}

const GridControls = ({ 
  gridCols, 
  gridGap, 
  onGridColsChange, 
  onGridGapChange 
}: GridControlsProps) => {
  return (
    <div className="flex flex-wrap gap-4 mt-4 mb-4">
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
  );
};

export default GridControls;
