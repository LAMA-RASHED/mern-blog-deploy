import { useState, useRef, useEffect, ChangeEvent } from 'react';

interface ImageUploaderProps {
  onImageSelected: (file: File | null) => void;
  onUrlEntered: (url: string) => void;
  initialImageUrl?: string;
}

const ImageUploader = ({
  onImageSelected,
  onUrlEntered,
  initialImageUrl = '',
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [useUrlInput, setUseUrlInput] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update imageUrl if initialImageUrl changes
  useEffect(() => {
    if (initialImageUrl) {
      setImageUrl(initialImageUrl);
      setUseUrlInput(true);
    }
  }, [initialImageUrl]);

  // Create preview URL for selected file
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    // Clean up function to revoke the object URL
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setUseUrlInput(false);
        onImageSelected(file);
        onUrlEntered('');
      }
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUseUrlInput(false);
      onImageSelected(file);
      onUrlEntered('');
    }
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    onUrlEntered(url);
  };

  const handleToggleInput = (useUrl: boolean) => {
    setUseUrlInput(useUrl);
    if (useUrl) {
      setSelectedFile(null);
      onImageSelected(null);
    } else {
      setImageUrl('');
      onUrlEntered('');
    }
  };

  return (
    <div className="my-4">
      <label className="form-label block mb-2">Image:</label>

      <div className="flex mb-2 space-x-2">
        <button
          type="button"
          className={`py-1 px-3 rounded text-sm ${
            useUrlInput ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleToggleInput(true)}
        >
          URL
        </button>
        <button
          type="button"
          className={`py-1 px-3 rounded text-sm ${
            !useUrlInput
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleToggleInput(false)}
        >
          Upload Image
        </button>
      </div>

      {useUrlInput ? (
        <div>
          <input
            type="url"
            value={imageUrl}
            onChange={handleUrlChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
          {imageUrl && (
            <div className="mt-2">
              <img
                src={imageUrl}
                alt="Preview"
                className="max-h-40 max-w-full object-contain rounded-md"
                onError={() => console.log('Image failed to load')}
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed p-6 rounded-md text-center cursor-pointer transition ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            {previewUrl ? (
              <div className="flex flex-col items-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-40 max-w-full object-contain rounded-md mb-2"
                />
                <span className="text-sm text-gray-600">
                  {selectedFile?.name} ({Math.round(selectedFile!.size / 1024)}{' '}
                  KB)
                </span>
                <span className="text-xs text-blue-600 mt-2">
                  Click or drag to change image
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <svg
                  className="w-12 h-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-600 mb-1">
                  Drag and drop an image here, or click to select
                </p>
                <span className="text-xs text-gray-500">
                  Supports: JPG, PNG, GIF (Max 5MB)
                </span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
