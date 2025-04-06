
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

  interface IEvent {
    e: Event;
    target?: fabric.Object;
  }

  namespace fabric {
    class Rect extends Object {
      width: number;
      height: number;
      left: number;
      top: number;
      set(options: any): this;
    }

    class Circle extends Object {
      radius: number;
      left: number;
      top: number;
      set(options: any): this;
    }

    class Textbox extends Object {
      set(options: any): this;
    }

    class Object {
      toJSON(propertiesToInclude?: string[]): any;
    }
  }
}

export {};
