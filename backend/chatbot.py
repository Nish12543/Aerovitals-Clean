import requests
import os
import speech_recognition as sr
import pyttsx3
from dotenv import load_dotenv

# Load Groq API key from .env file
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Groq API settings
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama3-8b-8192"  # Fast and reliable model

# Initialize text-to-speech engine
engine = pyttsx3.init()

def speak(text):
    """Convert text to speech."""
    engine.say(text)
    engine.runAndWait()

def listen():
    """Capture voice input from the user and convert it to text."""
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("🎤 Listening...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)
        try:
            print("🧠 Recognizing...")
            return recognizer.recognize_google(audio)  # type: ignore
        except sr.UnknownValueError:
            return "Sorry, I didn't catch that."
        except sr.RequestError:
            return "Speech recognition service is unavailable."

def get_chatbot_response(user_input):
    """Send user input to the Groq model and return the response."""
    if not GROQ_API_KEY:
        return "Error: GROQ_API_KEY not found in environment variables. Please set your Groq API key in the .env file."
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {
                "role": "system",
                "content": "You are an inflight medical assistant. Provide helpful, accurate medical advice for passengers during flights. Be concise but thorough."
            },
            {
                "role": "user",
                "content": user_input
            }
        ],
        "max_tokens": 500,
        "temperature": 0.7
    }
    
    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        
        if response.status_code == 200:
            output = response.json()
            return output["choices"][0]["message"]["content"]
        else:
            return f"[Error] {response.status_code}: {response.text}"
    except Exception as e:
        return f"Error connecting to Groq API: {str(e)}"

# Main loop for interaction
if __name__ == "__main__":
    # Check if GROQ_API_KEY is set
    if not GROQ_API_KEY:
        print("⚠️  Warning: GROQ_API_KEY not found in environment variables.")
        print("Please create a .env file in the backend directory with:")
        print("GROQ_API_KEY=your_groq_api_key_here")
        print("Get your key from: https://console.groq.com/keys")
        print("\nStarting in demo mode (will show error messages for API calls)...")
    
    speak("Hello, I am your inflight medical assistant. How can I help you?")
    while True:
        user_input = listen()
        print(f"You said: {user_input}")
        
        if "exit" in user_input.lower() or "stop" in user_input.lower():
            speak("Goodbye! Stay safe.")
            break

        response = get_chatbot_response(user_input)
        print(f"Assistant: {response}")
        speak(response)
