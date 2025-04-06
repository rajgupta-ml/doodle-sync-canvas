
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { useCollaboration } from "@/context/CollaborationContext";

export const Header: React.FC = () => {
  const { currentUser } = useCollaboration();

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">SynkDraw</h1>
        <div className="flex space-x-1">
          <button className="px-3 py-1 text-sm rounded hover:bg-gray-100">File</button>
          <button className="px-3 py-1 text-sm rounded hover:bg-gray-100">Edit</button>
          <button className="px-3 py-1 text-sm rounded hover:bg-gray-100">View</button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button size="sm" variant="outline" className="gap-1">
          <Share className="w-4 h-4" />
          <span>Share</span>
        </Button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
