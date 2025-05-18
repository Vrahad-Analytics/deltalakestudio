
import React from 'react';
import { Button } from "@/components/ui/button";
import { Database, Server, Folder, ArrowUpDown, Box, HardDrive } from 'lucide-react';

interface ComponentPaletteProps {
  onDragStart: (e: React.DragEvent, type: string, label: string) => void;
  isMobile?: boolean;
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onDragStart, isMobile }) => {
  // For mobile, we need to create a component and add it to the canvas since dragging isn't available
  const handleMobileClick = (type: string, label: string) => {
    // Create a custom event to mimic drag and drop
    const customEvent = new CustomEvent('component-selected', {
      detail: { type, label }
    });
    
    document.dispatchEvent(customEvent);
  };
  
  const renderPaletteItem = (type: string, label: string, icon: React.ReactNode) => {
    if (isMobile) {
      return (
        <div 
          className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 mb-2 flex items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600"
          onClick={() => handleMobileClick(type, label)}
        >
          <div className="mr-2 text-purple-500 dark:text-purple-400">
            {icon}
          </div>
          <span>{label}</span>
        </div>
      );
    }
    
    return (
      <div 
        className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 mb-2 flex flex-col items-center justify-center cursor-grab hover:shadow-md transition-shadow"
        draggable
        onDragStart={(e) => onDragStart(e, type, label)}
      >
        <div className="mb-1 text-purple-500 dark:text-purple-400">
          {icon}
        </div>
        <span className="text-xs text-center">{label}</span>
      </div>
    );
  };

  return (
    <div className={isMobile ? "w-full" : "w-28 mr-4 p-2"}>
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">Sources</h3>
        {renderPaletteItem('source', 'Data Source', <Database size={20} />)}
        {renderPaletteItem('s3', 'S3 Mount', <Folder size={20} />)}
      </div>
      
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">Processing</h3>
        {renderPaletteItem('transformation', 'Transform', <ArrowUpDown size={20} />)}
        {renderPaletteItem('cluster', 'Cluster', <Server size={20} />)}
      </div>
      
      <div>
        <h3 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">Outputs</h3>
        {renderPaletteItem('warehouse', 'Warehouse', <HardDrive size={20} />)}
        {renderPaletteItem('export', 'Export', <Box size={20} />)}
      </div>
    </div>
  );
};
