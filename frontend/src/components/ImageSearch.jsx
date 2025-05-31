import { useState } from 'react';
import { ArrowUpTrayIcon, FaceSmileIcon } from '@heroicons/react/24/outline';

export default function ImageSearch({ onSearchStart, onResults }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [options, setOptions] = useState({
    searchFaces: true,
    searchSocial: true
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    onSearchStart();
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('search_faces', options.searchFaces);
    formData.append('search_social', options.searchSocial);
    
    try {
      const response = await fetch('/api/search/image', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        // Try to get error details from response
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.detail || errorData.message || errorMsg;
        } catch {
          // If we can't parse JSON error, use default message
        }
        throw new Error(errorMsg);
      }
      
      const data = await response.json();
      onResults(data);
    } catch (error) {
      console.error('Image search failed:', error);
      // Pass error to parent component instead of alert
      onResults({ 
        error: error.message || 'Failed to perform image search',
        standard_results: [],
        face_results: []
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Upload image or screenshot
        </label>
        
        <label 
          htmlFor="image-upload" 
          className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition-colors"
        >
          {preview ? (
            <img 
              src={preview} 
              alt="Preview" 
              className="h-full w-full object-contain p-4"
              onLoad={() => URL.revokeObjectURL(preview)}
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <ArrowUpTrayIcon className="w-12 h-12 mb-3" />
              <p className="font-medium">Click to upload</p>
              <p className="text-sm mt-1">PNG, JPG, or JPEG (Max 5MB)</p>
            </div>
          )}
          <input 
            id="image-upload" 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </div>
      
      {/* Search Options */}
      <div className="mb-4 bg-gray-900 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Search Options</h3>
        
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="search-faces"
            checked={options.searchFaces}
            onChange={(e) => setOptions({...options, searchFaces: e.target.checked})}
            className="mr-2"
          />
          <label htmlFor="search-faces" className="flex items-center">
            <FaceSmileIcon className="w-5 h-5 mr-1" />
            Detect and search faces
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="search-social"
            checked={options.searchSocial}
            onChange={(e) => setOptions({...options, searchSocial: e.target.checked})}
            className="mr-2"
          />
          <label htmlFor="search-social">
            Include social media results (Instagram, Facebook)
          </label>
        </div>
      </div>
      
      <button 
        type="submit" 
        className="redact-btn w-full flex justify-center"
        disabled={!file}
      >
        Reverse Image Search
      </button>
    </form>
  );
}