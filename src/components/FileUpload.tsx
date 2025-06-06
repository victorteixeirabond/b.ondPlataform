import { clsx } from "clsx";
import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "./ui/button";

interface FileUploadProps {
  title: string;
  acceptedTypes: string;
  onFileSelect: (files: File[]) => void;
  multiple?: boolean;
  selectedFiles?: File[];
  isLoading?: boolean;
  handleFunction: () => Promise<void>;
    
  }

const FileUpload = ({ title, acceptedTypes, onFileSelect, multiple = false, selectedFiles = [], isLoading, handleFunction}: FileUploadProps) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    onFileSelect(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFileSelect(files);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFileSelect(newFiles);
  };

  return (
  <div className="space-y-2 w-full">
    <label className="block text-sm font-medium text-gray-700">{title}</label>

    <div className="flex gap-4 items-stretch w-full">
      {/* Upload area with fixed or proportional width */}
      <div
        className={clsx(
          "flex flex-col justify-center text-center border-2 border-dashed rounded-md p-4 transition-all w-3/4", // or w-[70%]
          dragOver ? "border-eucalyptus-dark bg-gray-300" : "bg-white",
          selectedFiles ? "border-eucalyptus-dark bg-eucalyptus-pale" : "border-gray-300"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-eucalyptus-dark">Clique para enviar ou arraste arquivos aqui</p>
        <p className="text-xs text-gray-500">Formatos aceitos: {acceptedTypes}</p>

        {selectedFiles.length > 0 && (
          <p className="text-sm text-eucalyptus-dark mt-2">
            {selectedFiles.length} arquivo(s) selecionado(s)
          </p>
        )}
      </div>

      {/* Button fills remaining space and matches height */}
      <Button
        onClick={handleFunction}
        className="flex-1 h-full border-eucalyptus-dark text-eucalyptus-dark hover:bg-eucalyptus-dark hover:text-white py-20"
        disabled={isLoading}
      >
        {isLoading ? "Enviando..." : "---> Enviar"}
      </Button>
    </div>
  </div>

  );

};

export default FileUpload;
