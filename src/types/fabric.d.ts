
import { fabric } from "fabric";

declare module "fabric" {
  interface Canvas {
    isDrawingMode: boolean;
    freeDrawingBrush: fabric.BaseBrush;
    getActiveObject(): fabric.Object | null;
    getActiveObjects(): fabric.Object[];
    discardActiveObject(): fabric.Canvas;
    renderAll(): fabric.Canvas;
  }

  interface BaseBrush {
    color: string;
    width: number;
    shadow?: fabric.Shadow | null;
  }
}

export {};
