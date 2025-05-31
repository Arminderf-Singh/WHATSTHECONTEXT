
import { useState } from 'react';

import TextSearch from './components/TextSearch';
import ImageSearch from './components/ImageSearch';
import SearchResults from './components/SearchResults';

function App() {
  const [activeTab, setActiveTab] = useState('text');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleResults = (data) => {
    setResults(data.results || []);
    setLoading(false);
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
              <div className="tab-pane active">
                <h3>Video Clip Context</h3>
                <p className="text-gray-400 mb-4">Enter a video URL to find the original context</p>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Paste a video URL (YouTube, TikTok, etc.)"
                />
                <button className="search-btn">Find Full Video</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {results && (
  <section className="results-section mt-12">
    <div className="section-header">
      <h2>Search Results</h2>
    </div>
    <div className="results-container">
      <SearchResults results={results} />
    </div>
  </section>
)}

      
      {/* Delete Options Section */}
      <section className="delete-options">
        <div className="section-header">
          <h2>Content Management</h2>
          <p>Take control of your online presence with our powerful tools</p>
        </div>
        
        <div className="options-card">
          <h3>
            <i className="fas fa-trash-alt text-redact-accent"></i>
            Mass delete your Facebook posts
          </h3>
          <p>The only platform that allows you to automatically clean up your old posts from services like Twitter, Facebook, Discord, and more, all in one place.</p>
          
          <div className="mt-6">
            <h4 className="text-lg font-bold mb-3">Delete Options</h4>
            <ul>
              <li>
                <i className="fas fa-comment text-redact-accent"></i>
                Posts
              </li>
              <li>
                <i className="fas fa-comment-dots text-redact-accent"></i>
                Comments
              </li>
              <li>
                <i className="fas fa-video text-redact-accent"></i>
                Live
              </li>
            </ul>
          </div>
          
          <div className="mt-6">
            <h4 className="text-lg font-bold mb-3">Platform Integration</h4>
            <div className="platforms">
              <div className="platform">
                <i className="fab fa-twitter text-blue-400"></i>
                Twitter
              </div>
              <div className="platform">
                <i className="fab fa-facebook text-blue-600"></i>
                Facebook
              </div>
              <div className="platform">
                <i className="fab fa-discord text-indigo-500"></i>
                Discord
              </div>
              <div className="platform">
                <i className="fab fa-instagram text-pink-500"></i>
                Instagram
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
          <a href="#">Documentation</a>
          <a href="#">API</a>
        </div>
        <p>© 2023 WhatsTheContext. All rights reserved. Designed to match Redact.dev theme.</p>
      </footer>
    </div>
  );
}

export default App;