
import React, { createContext, useContext, useState, useEffect } from "react";

export type DrawingTool = 
  | "select" 
  | "pen" 
  | "eraser" 
  | "rectangle" 
  | "circle" 
  | "text" 
  | "image";

export type Layer = {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
};

interface DrawingContextType {
  activeTool: DrawingTool;
  setActiveTool: (tool: DrawingTool) => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  layers: Layer[];
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  activeLayer: string | null;
  setActiveLayer: (layerId: string | null) => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  addLayer: (name: string) => void;
  removeLayer: (layerId: string) => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const DrawingProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [activeTool, setActiveTool] = useState<DrawingTool>("pen");
  const [strokeColor, setStrokeColor] = useState<string>("#000000");
  const [strokeWidth, setStrokeWidth] = useState<number>(5);
  const [opacity, setOpacity] = useState<number>(100);
  const [layers, setLayers] = useState<Layer[]>([
    { id: "layer-1", name: "Layer 1", visible: true, locked: false },
    { id: "layer-2", name: "Layer 2", visible: true, locked: false },
  ]);
  const [activeLayer, setActiveLayer] = useState<string | null>("layer-1");

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === layerId 
          ? { ...layer, visible: !layer.visible } 
          : layer
      )
    );
  };

  const toggleLayerLock = (layerId: string) => {
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === layerId 
          ? { ...layer, locked: !layer.locked } 
          : layer
      )
    );
  };

  const addLayer = (name: string) => {
    const newLayer: Layer = {
      id: `layer-${layers.length + 1}`,
      name,
      visible: true,
      locked: false,
    };
    
    setLayers([...layers, newLayer]);
    setActiveLayer(newLayer.id);
  };

  const removeLayer = (layerId: string) => {
    // Don't remove if it's the only layer
    if (layers.length <= 1) return;
    
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== layerId));
    
    // If removing active layer, set first available layer as active
    if (activeLayer === layerId) {
      const remainingLayers = layers.filter(layer => layer.id !== layerId);
      if (remainingLayers.length > 0) {
        setActiveLayer(remainingLayers[0].id);
      } else {
        setActiveLayer(null);
      }
    }
  };

  return (
    <DrawingContext.Provider
      value={{
        activeTool,
        setActiveTool,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        opacity,
        setOpacity,
        layers,
        setLayers,
        activeLayer,
        setActiveLayer,
        toggleLayerVisibility,
        toggleLayerLock,
        addLayer,
        removeLayer,
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => {
  const context = useContext(DrawingContext);
  if (context === undefined) {
    throw new Error("useDrawing must be used within a DrawingProvider");
  }
  return context;
};
