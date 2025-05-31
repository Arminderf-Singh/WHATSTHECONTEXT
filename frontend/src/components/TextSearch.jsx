import { useState } from 'react';

export default function TextSearch({ onSearchStart, onResults }) {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    onSearchStart();
    try {
      const response = await fetch('/api/search/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      onResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      onResults({ results: [] });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="text-input" className="block mb-2 font-medium">
          Enter text or quote
        </label>
        <textarea
          id="text-input"
          rows={4}
          className="text-area"
          placeholder="Paste text snippet, quote, or video transcript..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <button 
        type="submit" 
        className="redact-btn w-full flex justify-center"
        disabled={!text.trim()}
      >
        {!text.trim() ? 'Enter text to search' : 'Find Original Source'}
      </button>
    </form>
  );
}