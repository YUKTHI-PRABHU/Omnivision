import './App.css';
import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('en'); // Default language is English
  const [voices, setVoices] = useState([]); // Available voices for speech synthesis
  const [errorMessage, setErrorMessage] = useState(''); // Error message for invalid files
  const fileInputRef = useRef(null); // Reference for the file input

  // Load voices on mount
  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      console.log(availableVoices); // Log voices to check availability
      setVoices(availableVoices);
    };
    loadVoices();
    synth.onvoiceschanged = loadVoices; // Ensure voices load properly
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload a valid image file.');
        setSelectedImage(null); // Clear any previously selected image
        setDescription('');
        return;
      } else {
        setErrorMessage('');
        setSelectedImage(URL.createObjectURL(file)); // Set image preview

        // Use file name (without extension) as description
        const fileName = file.name.split('.').slice(0, -1).join('.');
        setDescription(fileName);
      }
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value); // Update the selected language
  };

  const handleClear = () => {
    setSelectedImage(null); // Clear the image preview
    setDescription(''); // Clear the description text
    setLanguage('en'); // Reset language selection to English
    fileInputRef.current.value = ''; // Clear the file input field (name)
    setErrorMessage(''); // Clear any error message
  };

  const handleAudio = () => {
    if (!window.speechSynthesis) {
      alert('Your browser does not support text-to-speech functionality.');
      return;
    }

    if (description) {
      console.log('Starting speech synthesis...');
      const speech = new SpeechSynthesisUtterance(description);
      speech.lang = language; // Set language for speech synthesis

      // Find a suitable voice for the selected language
      const selectedVoice = voices.find((voice) => voice.lang === language);
      if (selectedVoice) {
        console.log(`Using voice: ${selectedVoice.name}`);
        speech.voice = selectedVoice;
      } else {
        console.log('No suitable voice found for selected language');
      }

      // Customize speech properties
      speech.volume = 1; // Full volume
      speech.rate = 1; // Normal rate
      speech.pitch = 1; // Normal pitch

      // Handle speech start and end
      speech.onstart = () => console.log('Speech started...');
      speech.onend = () => console.log('Speech finished.');

      // Speak the description
      window.speechSynthesis.speak(speech);
    } else {
      alert('No description available to read!');
    }
  };

  return (
    <div>
      {/* Heading Outside the Box */}
      <h1 className="main-heading">Omnivision</h1>

      {/* Main Container */}
      <div className="container">
        <h2>Welcome to the Image Description Generator</h2>

        <form>
          {/* File Input for Image */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef} // Assign the ref to the file input
            title="Only image files are accepted." // Tooltip on hover
          />

          {/* Show error message if the user selects a non-image file */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {/* Dropdown for Language Selection */}
          <select
            className="language-select"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="ja">Japanese</option>
            <option value="pt">Portuguese</option>
          </select>
        </form>

        {/* Image Preview Section */}
        {selectedImage && (
          <div className="image-preview">
            <h3>Selected Image:</h3>
            <img src={selectedImage} alt="Selected" />
          </div>
        )}

        {/* Description Section */}
        {description && (
          <div className="description">
            <h3>Description:</h3>
            <p>{description}</p>

            {/* Clear Button */}
            <button type="button" className="clear-button" onClick={handleClear}>
              Clear
            </button>

            {/* Audio Button */}
            <button type="button" className="audio-button" onClick={handleAudio}>
              🔊 Read Aloud
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
