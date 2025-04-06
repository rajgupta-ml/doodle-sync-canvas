
import { useDrawing } from "@/context/DrawingContext";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export const PropertiesPanel: React.FC = () => {
  const { 
    strokeWidth, 
    setStrokeWidth, 
    opacity, 
    setOpacity,
    strokeColor,
    setStrokeColor,
    layers,
    activeLayer,
    setActiveLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    addLayer,
    removeLayer
  } = useDrawing();

  return (
    <div className="w-72 border-l bg-white h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="thickness">Thickness</Label>
              <span className="text-sm text-gray-500">{strokeWidth}px</span>
            </div>
            <Slider
              id="thickness"
              min={1}
              max={50}
              step={1}
              value={[strokeWidth]}
              onValueChange={(value) => setStrokeWidth(value[0])}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="opacity">Opacity</Label>
              <span className="text-sm text-gray-500">{opacity}%</span>
            </div>
            <Slider
              id="opacity"
              min={1}
              max={100}
              step={1}
              value={[opacity]}
              onValueChange={(value) => setOpacity(value[0])}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Layers</h2>
          <button 
            className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center"
            onClick={() => addLayer(`Layer ${layers.length + 1}`)}
          >
            +
          </button>
        </div>
        
        <div className="space-y-2">
          {layers.map((layer) => (
            <div 
              key={layer.id}
              className={`flex items-center justify-between p-2 rounded ${
                activeLayer === layer.id ? "bg-purple-100" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveLayer(layer.id)}
            >
              <div className="flex items-center space-x-2">
                <button
                  className="w-5 h-5 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerVisibility(layer.id);
                  }}
                >
                  {layer.visible ? "👁️" : "👁️‍🗨️"}
                </button>
                <span>{layer.name}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  className="w-5 h-5 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerLock(layer.id);
                  }}
                >
                  {layer.locked ? "🔒" : "🔓"}
                </button>
                <button
                  className="w-5 h-5 flex items-center justify-center text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLayer(layer.id);
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
