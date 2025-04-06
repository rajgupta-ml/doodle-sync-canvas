
import { Header } from "@/components/Header";
import { Toolbar } from "@/components/Toolbar";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { PropertiesPanel } from "@/components/PropertiesPanel";
import { TeamPanel } from "@/components/TeamPanel";

const Index = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <DrawingCanvas />
        <Toolbar />
        <PropertiesPanel />
        <TeamPanel />
      </div>
    </div>
  );
};

export default Index;
