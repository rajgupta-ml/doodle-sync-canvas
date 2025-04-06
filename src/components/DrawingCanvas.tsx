
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useDrawing } from "@/context/DrawingContext";
import { socket } from "@/lib/socket";
import { useCollaboration } from "@/context/CollaborationContext";
import { toast } from "sonner";

export const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  
  const { 
    activeTool, 
    strokeColor, 
    strokeWidth, 
    opacity,
    layers,
    activeLayer
  } = useDrawing();
  
  const { currentUser } = useCollaboration();

  // Initialize the canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: activeTool === "pen",
      width: window.innerWidth - 330, // Subtract sidebar and toolbar width
      height: window.innerHeight - 100, // Subtract header height
      backgroundColor: "#ffffff"
    });

    setFabricCanvas(canvas);
    
    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth - 330,
        height: window.innerHeight - 100
      });
      canvas.renderAll();
    };

    window.addEventListener("resize", handleResize);
    
    // Notify other users that we're here
    socket.emit("user-joined", {
      userId: currentUser.id,
      userName: currentUser.name
    });
    
    toast.success("Canvas ready! Start drawing!");

    return () => {
      canvas.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Update drawing mode based on active tool
  useEffect(() => {
    if (!fabricCanvas) return;

    // Set drawing mode
    fabricCanvas.isDrawingMode = activeTool === "pen" || activeTool === "eraser";
    
    // Configure brush for different tools
    if (activeTool === "pen") {
      fabricCanvas.freeDrawingBrush.color = strokeColor;
      fabricCanvas.freeDrawingBrush.width = strokeWidth;
    } else if (activeTool === "eraser") {
      fabricCanvas.freeDrawingBrush.color = "#ffffff";
      fabricCanvas.freeDrawingBrush.width = strokeWidth * 2;
    }
    
    // Reset selection when switching tools
    if (activeTool !== "select") {
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
    }
    
    // Tool-specific handlers
    const handleMouseDown = (options: { e: MouseEvent }) => {
      if (!fabricCanvas) return;
      
      const pointer = fabricCanvas.getPointer(options.e);
      
      if (activeTool === "rectangle") {
        const rect = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          fill: "transparent",
          stroke: strokeColor,
          strokeWidth,
          opacity: opacity / 100,
        });
        
        fabricCanvas.add(rect);
        fabricCanvas.setActiveObject(rect);
      } else if (activeTool === "circle") {
        const circle = new fabric.Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 0,
          fill: "transparent",
          stroke: strokeColor,
          strokeWidth,
          opacity: opacity / 100,
        });
        
        fabricCanvas.add(circle);
        fabricCanvas.setActiveObject(circle);
      } else if (activeTool === "text") {
        const text = new fabric.Textbox("Double click to edit", {
          left: pointer.x,
          top: pointer.y,
          fill: strokeColor,
          fontSize: strokeWidth * 3,
          fontFamily: 'Arial',
          opacity: opacity / 100,
        });
        
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
      }
    };

    fabricCanvas.on("mouse:down", handleMouseDown);
    
    return () => {
      fabricCanvas.off("mouse:down", handleMouseDown);
    };
  }, [activeTool, strokeColor, strokeWidth, opacity, fabricCanvas]);

  // Emit object added/modified events for collaboration
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const handleObjectAdded = (e: fabric.IEvent) => {
      // In a real app, you would emit this to the socket
      socket.emit("object-added", {
        userId: currentUser.id,
        objectJSON: e.target?.toJSON()
      });
    };
    
    const handleObjectModified = (e: fabric.IEvent) => {
      // In a real app, you would emit this to the socket
      socket.emit("object-modified", {
        userId: currentUser.id,
        objectJSON: e.target?.toJSON()
      });
    };
    
    fabricCanvas.on("object:added", handleObjectAdded);
    fabricCanvas.on("object:modified", handleObjectModified);
    
    return () => {
      fabricCanvas.off("object:added", handleObjectAdded);
      fabricCanvas.off("object:modified", handleObjectModified);
    };
  }, [fabricCanvas, currentUser.id]);

  return (
    <div className="flex-1 overflow-hidden drawing-area relative">
      <canvas ref={canvasRef} className="absolute" />
    </div>
  );
};
