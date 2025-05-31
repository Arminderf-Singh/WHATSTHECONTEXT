import { useState } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

import TextSearch from './components/TextSearch';
import ImageSearch from './components/ImageSearch';
import SearchResults from './components/SearchResults';

function App() {
  const [activeTab, setActiveTab] = useState('text');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeMethod, setActiveMethod] = useState('url');
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');

  const handleResults = (data) => {
    setResults(data);
    setLoading(false);
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleVideoSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResults({
        video: {
          title: "Full Video Context Found",
          source: "YouTube",
          url: "https://youtube.com/full-video",
          matches: [
            { time: "2:15", context: "Introduction to the main topic" },
            { time: "5:42", context: "Detailed explanation of concept" }
          ]
        }
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav>
        <div className="logo">
          <i className="fas fa-search"></i>
          <span>WhatsTheContext</span>
        </div>
        
        <div className="nav-links">
          <a href="#">Access</a>
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Business</a>
          <a href="#">Textbooks</a>
          <a href="#">New Events</a>
        </div>
        
        <div className="nav-right">
          <a href="#" className="btn btn-login">Login</a>
          <a href="#" className="btn btn-download">Free Download</a>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="hero">
        <h1>Discover the Full Context</h1>
        <p>WhatsTheContext helps you find the original sources of quotes, video clips, and images. Reverse search media to get the full story behind the content you encounter online.</p>
        <a href="#search" className="btn btn-download">Get Started</a>
      </section>
      
      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2>Powerful Search Capabilities</h2>
          <p>Our platform helps you uncover the original context behind media content with advanced search technology.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-quote-right"></i>
            </div>
            <h3>Quote Source Finder</h3>
            <p>Discover the original source of any quote. We'll find where it was first said and in what context.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-film"></i>
            </div>
            <h3>Video Clip Context</h3>
            <p>Upload or link to a video clip to find the full video it came from and understand its original context.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-camera"></i>
            </div>
            <h3>Reverse Image Search</h3>
            <p>Find the original source of any image and see where else it's been used across the web.</p>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section id="search" className="search-section">
        <div className="section-header">
          <h2>Find the Context</h2>
          <p>Search for the original source of media content in seconds</p>
        </div>
        
        <div className="search-container">
          <div className="search-tabs">
            <div 
              className={`tab ${activeTab === 'text' ? 'active' : ''}`}
              onClick={() => setActiveTab('text')}
            >
              Text Search
            </div>
            <div 
              className={`tab ${activeTab === 'image' ? 'active' : ''}`}
              onClick={() => setActiveTab('image')}
            >
              Reverse Image
            </div>
            <div 
              className={`tab ${activeTab === 'video' ? 'active' : ''}`}
              onClick={() => setActiveTab('video')}
            >
              Video Context
            </div>
          </div>
          
          <div className="tab-content">
            {activeTab === 'text' ? (
              <TextSearch 
                onSearchStart={() => setLoading(true)} 
                onResults={handleResults}
              />
            ) : activeTab === 'image' ? (
              <ImageSearch 
                onSearchStart={() => setLoading(true)} 
                onResults={handleResults}
              />
            ) : (
              <div className="video-tab-content">
                <h3>Video Clip Context</h3>
                <p className="text-gray-400 mb-4">Find the original source of a video clip by URL or upload</p>

                <div className="method-tabs">
                  <button 
                    className={`method-tab ${activeMethod === 'url' ? 'active' : ''}`}
                    onClick={() => setActiveMethod('url')}
                  >
                    Paste URL
                  </button>
                  <button 
                    className={`method-tab ${activeMethod === 'upload' ? 'active' : ''}`}
                    onClick={() => setActiveMethod('upload')}
                  >
                    Upload Video
                  </button>
                </div>

                <form onSubmit={handleVideoSubmit}>
                  {activeMethod === 'url' ? (
                    <div className="video-search-form">
                      <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Paste a video URL (YouTube, TikTok, etc.)"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                      />
                      <button 
                        type="submit" 
                        className="search-btn"
                        disabled={!videoUrl.trim()}
                      >
                        {loading ? 'Searching...' : 'Find Full Video'}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label 
                        htmlFor="video-upload" 
                        className="video-upload-area"
                      >
                        {videoPreview ? (
                          <video 
                            src={videoPreview} 
                            className="video-preview"
                            controls
                          />
                        ) : (
                          <div className="video-upload-placeholder">
                            <ArrowUpTrayIcon className="w-12 h-12 mb-3" />
                            <p className="font-medium">Click to upload video</p>
                            <p className="text-sm mt-1">MP4 or MOV (Max 50MB)</p>
                          </div>
                        )}
                        <input 
                          id="video-upload" 
                          type="file" 
                          className="hidden" 
                          accept="video/*"
                          onChange={handleVideoFileChange}
                        />
                      </label>
                      <button 
                        type="submit" 
                        className="search-btn"
                        disabled={!videoFile}
                      >
                        {loading ? 'Searching...' : 'Find Full Video'}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {results && (
        <section className="results-section">
          <div className="section-header">
            <h2>Search Results</h2>
          </div>
          <div className="results-container">
            <SearchResults results={results} />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
          <a href="#">Documentation</a>
          <a href="#">API</a>
        </div>
        <p>© 2025 WhatsTheContext. All rights reserved. </p>
      </footer>
    </div>
  );
}

export default App;