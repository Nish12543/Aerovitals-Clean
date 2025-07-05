import requests
import os
from dotenv import load_dotenv

# Load Groq API key from .env file
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Groq API settings
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama3-8b-8192"

def test_groq_chatbot():
    """Test the Groq chatbot with text input."""
    if not GROQ_API_KEY:
        print("Error: GROQ_API_KEY not found in environment variables.")
        return
    
    test_input = "I have a headache during the flight"
    
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
                "content": test_input
            }
        ],
        "max_tokens": 500,
        "temperature": 0.7
    }
    
    try:
        print(f"Testing with input: {test_input}")
        print(f"Using model: {GROQ_MODEL}")
        
        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            output = response.json()
            print(f"✅ Success! Response: {output['choices'][0]['message']['content']}")
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response Text: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

if __name__ == "__main__":
    test_groq_chatbot() 