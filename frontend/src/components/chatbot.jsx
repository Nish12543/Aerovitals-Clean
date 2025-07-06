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
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '1rem',
      backgroundColor: '#B5FFE1',
      borderRadius: '16px',
      boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
      height: '80vh',
      display: 'flex',
      flexDirection: 'column',
      '@media (max-width: 768px)': {
        height: '70vh',
        padding: '0.75rem',
        margin: '0 0.5rem',
      },
      '@media (max-width: 480px)': {
        height: '65vh',
        padding: '0.5rem',
      }
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#36827F',
        marginBottom: '1.25rem',
        fontSize: '1.5rem',
        '@media (max-width: 768px)': {
          fontSize: '1.25rem',
          marginBottom: '1rem',
        },
        '@media (max-width: 480px)': {
          fontSize: '1.125rem',
          marginBottom: '0.75rem',
        }
      }}>
        🛫 AeroVitals Voice Chatbot
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        flex: 1,
        overflowY: 'auto',
        padding: '0.75rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        marginBottom: '1rem',
        '@media (max-width: 768px)': {
          padding: '0.5rem',
          gap: '0.5rem',
        }
      }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#b74545' : '#683B4A',
              color: '#fff',
              padding: '0.75rem 1rem',
              borderRadius: '16px',
              maxWidth: '80%',
              wordWrap: 'break-word',
              fontSize: '0.875rem',
              lineHeight: 1.4,
              borderTopLeftRadius: msg.sender === 'user' ? '16px' : '4px',
              borderTopRightRadius: msg.sender === 'user' ? '4px' : '16px',
              '@media (max-width: 768px)': {
                maxWidth: '85%',
                padding: '0.625rem 0.875rem',
                fontSize: '0.8rem',
              },
              '@media (max-width: 480px)': {
                maxWidth: '90%',
                padding: '0.5rem 0.75rem',
                fontSize: '0.75rem',
              }
            }}
          >
            <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        <input
          type="text"
          placeholder="Type your message or use voice..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          style={{
            width: '100%',
            padding: '0.875rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '1rem',
            backgroundColor: 'white',
            minHeight: '44px',
            '@media (max-width: 768px)': {
              fontSize: '16px',
              padding: '0.75rem',
            },
            '@media (max-width: 480px)': {
              padding: '0.625rem',
              fontSize: '0.875rem',
            }
          }}
        />
        
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          '@media (max-width: 768px)': {
            gap: '0.5rem',
          }
        }}>
          <button 
            type="submit" 
            style={{
              background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.875rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              minHeight: '44px',
              flex: 1,
              transition: 'transform 0.2s',
              '@media (max-width: 768px)': {
                padding: '0.75rem 1.25rem',
                fontSize: '0.875rem',
              },
              '@media (max-width: 480px)': {
                padding: '0.625rem 1rem',
                fontSize: '0.8rem',
              }
            }}
          >
            Send
          </button>
          <button
            type="button"
            onClick={listening ? stopListening : startListening}
            disabled={!canStartListening && !listening}
            style={{
              background: listening ? '#FF5252' : '#2C98F0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.875rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: (!canStartListening && !listening) ? 'not-allowed' : 'pointer',
              opacity: (!canStartListening && !listening) ? 0.6 : 1,
              minHeight: '44px',
              minWidth: '120px',
              transition: 'transform 0.2s',
              '@media (max-width: 768px)': {
                padding: '0.75rem 1.25rem',
                fontSize: '0.875rem',
                minWidth: '100px',
              },
              '@media (max-width: 480px)': {
                padding: '0.625rem 1rem',
                fontSize: '0.8rem',
                minWidth: '90px',
              }
            }}
          >
            🎤 {listening ? 'Stop' : 'Speak'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
