import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [listening, setListening] = useState(false);
  const [canStartListening, setCanStartListening] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        console.log('Speech recognition result:', event.results);
        const transcript = event.results[0][0].transcript;
        setUserMessage(transcript);
        setListening(false);
        // Add a small delay before allowing new speech recognition
        setTimeout(() => {
          setCanStartListening(true);
        }, 500);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        console.error('Error details:', event);
        setListening(false);
        setCanStartListening(true);
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setListening(false);
        setCanStartListening(true);
      };

      recognition.onstart = () => {
        console.log('Speech recognition started');
      };

      recognitionRef.current = recognition;
    } else {
      console.error('Speech Recognition not supported in this browser. Try Chrome.');
      alert('Speech Recognition not supported in this browser. Try Chrome.');
    }

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current && canStartListening) {
      setCanStartListening(false);
      // Stop any existing recognition first
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors if not already started
      }
      
      // Small delay to ensure proper cleanup
      setTimeout(() => {
        try {
          setListening(true);
          recognitionRef.current.start();
        } catch (error) {
          console.error('Error starting speech recognition:', error);
          setListening(false);
          setCanStartListening(true);
        }
      }, 100);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors
      }
      setListening(false);
      setCanStartListening(true);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!userMessage.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: userMessage }];
    setMessages(newMessages);
    setUserMessage('');

    try {
      console.log('Sending message to backend:', userMessage);
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: userMessage,
      });

      console.log('Backend response:', response.data);
      const chatbotReply = response.data.response;
      setMessages([...newMessages, { sender: 'chatbot', text: chatbotReply }]);
      speak(chatbotReply); // Read the chatbot response aloud
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      setMessages([...newMessages, { sender: 'chatbot', text: 'Sorry, I cannot connect to the backend server. Please make sure the server is running.' }]);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🛫 AeroVitals Voice Chatbot</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#b74545' : '#683B4A',
              color: '#fff',
              borderTopLeftRadius: msg.sender === 'user' ? 16 : 4,
              borderTopRightRadius: msg.sender === 'user' ? 4 : 16,
            }}
          >
            <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={styles.inputArea}>
        <input
          type="text"
          placeholder="Type your message or use voice..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Send</button>
        <button
          type="button"
          onClick={listening ? stopListening : startListening}
          disabled={!canStartListening && !listening}
          style={{ 
            ...styles.button, 
            backgroundColor: listening ? '#FF5252' : '#2C98F0',
            opacity: (!canStartListening && !listening) ? 0.6 : 1,
            cursor: (!canStartListening && !listening) ? 'not-allowed' : 'pointer'
          }}
        >
          🎤 {listening ? 'Stop Listening' : 'Speak'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#B5FFE1',
    borderRadius: '16px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    color: '#36827F',
    marginBottom: '20px',
  },
  chatBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    height: '350px',
    overflowY: 'auto',
    padding: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '2px solid #36827F',
  },
  message: {
    maxWidth: '75%',
    padding: '12px',
    borderRadius: '16px',
    fontSize: '14px',
  },
  inputArea: {
    display: 'flex',
    marginTop: '16px',
    gap: '10px',
  },
  input: {
    flexGrow: 1,
    padding: '10px 12px',
    fontSize: '16px',
    border: '2px solid #30b9f9',
    borderRadius: '8px',
  },
  button: {
    backgroundColor: '#0E85FB',
    color: 'white',
    border: 'none',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default Chatbot;
