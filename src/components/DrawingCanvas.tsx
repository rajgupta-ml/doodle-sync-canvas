
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useDrawing } from "@/context/DrawingContext";
import { socket } from "@/lib/socket";
import { useCollaboration } from "@/context/CollaborationContext";
import { toast } from "sonner";

export const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  
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
    
    // Clean up mouse event handlers
    fabricCanvas.off('mouse:down');
    fabricCanvas.off('mouse:move');
    fabricCanvas.off('mouse:up');
    
    // Tool-specific handlers
    const handleMouseDown = (options: { e: MouseEvent }) => {
      if (!fabricCanvas) return;
      
      const pointer = fabricCanvas.getPointer(options.e);
      setStartPoint({ x: pointer.x, y: pointer.y });
      
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
        setActiveObject(rect);
        setIsDrawing(true);
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
        setActiveObject(circle);
        setIsDrawing(true);
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

    const handleMouseMove = (options: { e: MouseEvent }) => {
      if (!isDrawing || !fabricCanvas || !activeObject || !startPoint) return;
      
      const pointer = fabricCanvas.getPointer(options.e);
      
      if (activeTool === "rectangle" && activeObject instanceof fabric.Rect) {
        const width = Math.abs(pointer.x - startPoint.x);
        const height = Math.abs(pointer.y - startPoint.y);
        
        // Adjust the left/top position if the user drags leftward/upward
        if (pointer.x < startPoint.x) {
          activeObject.set({ left: pointer.x });
        }
        if (pointer.y < startPoint.y) {
          activeObject.set({ top: pointer.y });
        }
        
        activeObject.set({ width, height });
        fabricCanvas.renderAll();
      } else if (activeTool === "circle" && activeObject instanceof fabric.Circle) {
        // Calculate radius based on distance from start point
        const dx = pointer.x - startPoint.x;
        const dy = pointer.y - startPoint.y;
        const radius = Math.sqrt(dx * dx + dy * dy);
        
        activeObject.set({ radius });
        fabricCanvas.renderAll();
      }
    };

    const handleMouseUp = () => {
      if (isDrawing && fabricCanvas && activeObject) {
        setIsDrawing(false);
        setActiveObject(null);
        fabricCanvas.renderAll();
        
        // Emit the object to other users
        socket.emit("object-added", {
          userId: currentUser.id,
          objectJSON: activeObject.toJSON()
        });
      }
    };

    fabricCanvas.on("mouse:down", handleMouseDown);
    fabricCanvas.on("mouse:move", handleMouseMove);
    fabricCanvas.on("mouse:up", handleMouseUp);
    
    return () => {
      fabricCanvas.off("mouse:down", handleMouseDown);
      fabricCanvas.off("mouse:move", handleMouseMove);
      fabricCanvas.off("mouse:up", handleMouseUp);
    };
  }, [activeTool, strokeColor, strokeWidth, opacity, fabricCanvas, isDrawing, activeObject, startPoint, currentUser.id]);

  // Emit object added/modified events for collaboration
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const handleObjectAdded = (e: fabric.IEvent) => {
      // In a real app, you would emit this to the socket
      if (!isDrawing && e.target) {  // Only emit if not in the middle of drawing
        socket.emit("object-added", {
          userId: currentUser.id,
          objectJSON: e.target.toJSON()
        });
      }
    };
    
    const handleObjectModified = (e: fabric.IEvent) => {
      // In a real app, you would emit this to the socket
      if (e.target) {
        socket.emit("object-modified", {
          userId: currentUser.id,
          objectJSON: e.target.toJSON()
        });
      }
    };
    
    fabricCanvas.on("object:added", handleObjectAdded);
    fabricCanvas.on("object:modified", handleObjectModified);
    
    return () => {
      fabricCanvas.off("object:added", handleObjectAdded);
      fabricCanvas.off("object:modified", handleObjectModified);
    };
  }, [fabricCanvas, currentUser.id, isDrawing]);

  return (
    <div className="flex-1 overflow-hidden drawing-area relative">
      <canvas ref={canvasRef} className="absolute" />
    </div>
  );
};
