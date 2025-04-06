
import { useDrawing } from "@/context/DrawingContext";
import { 
  MousePointer, 
  Pen, 
  Square, 
  Circle, 
  Type, 
  Image, 
  Eraser 
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Toolbar: React.FC = () => {
  const { activeTool, setActiveTool } = useDrawing();

  const tools = [
    { id: "select", icon: MousePointer, label: "Select" },
    { id: "pen", icon: Pen, label: "Pen" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "text", icon: Type, label: "Text" },
    { id: "image", icon: Image, label: "Image" },
  ];

  return (
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col bg-white rounded-lg shadow-lg p-2 space-y-2">
      {tools.map((tool) => (
        <button
          key={tool.id}
          className={cn(
            "toolbar-btn group relative",
            activeTool === tool.id && "active"
          )}
          onClick={() => setActiveTool(tool.id as any)}
          title={tool.label}
        >
          <tool.icon className="w-5 h-5" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {tool.label}
          </span>
        </button>
      ))}
    </div>
  );
};
