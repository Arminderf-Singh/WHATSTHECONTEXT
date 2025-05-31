import React from 'react';
export default function SearchTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex mb-6 border-b border-gray-700">
      {['text', 'image'].map((tab) => (
        <button
          key={tab}
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === tab
              ? 'border-redact-accent text-white'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab === 'text' ? 'Text Search' : 'Reverse Image Search'}
        </button>
      ))}
    </div>
  );
}