import React from 'react';
export default function SearchResults({ results }) {
  return (
    <div className="mt-8 redact-card">
      <h2 className="text-2xl font-bold mb-4">Search Results</h2>
      
      {/* Face Results */}
      {results.face_results?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Face Matches</h3>
          {results.face_results.map((faceResult, index) => (
            <div key={index} className="mb-6">
              <div className="flex items-center mb-3">
                <span className="bg-redact-accent text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                  {index + 1}
                </span>
                <h4 className="font-medium">Face #{index + 1} Matches</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(faceResult.results).map(([engine, engineResults]) => (
                  <div key={engine} className="bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-gray-700 text-white px-2 py-1 rounded text-sm capitalize mr-2">
                        {engine}
                      </span>
                      <h5 className="font-medium">{engine} Results</h5>
                    </div>
                    
                    {engineResults.error ? (
                      <p className="text-redact-accent">Error: {engineResults.error}</p>
                    ) : (
                      <ul className="space-y-2">
                        {engineResults.slice(0, 3).map((result, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-gray-500 mr-2">•</span>
                            <a 
                              href={result.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                            >
                              {result.title || result.url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Standard Results */}
      {results.standard_results && (
        <div>
          <h3 className="text-xl font-semibold mb-3">General Image Matches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(results.standard_results).map(([engine, engineResults]) => (
              <div key={engine} className="bg-gray-900 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="bg-gray-700 text-white px-2 py-1 rounded text-sm capitalize mr-2">
                    {engine}
                  </span>
                  <h5 className="font-medium">{engine} Results</h5>
                </div>
                
                {engineResults.error ? (
                  <p className="text-redact-accent">Error: {engineResults.error}</p>
                ) : (
                  <ul className="space-y-2">
                    {engineResults.slice(0, 5).map((result, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-gray-500 mr-2">•</span>
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {result.title || result.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}