import os
from dotenv import load_dotenv

def setup_groq():
    """Help users set up their Groq API key."""
    print("🚀 Setting up Groq API for AeroVitals Chatbot")
    print("=" * 50)
    
    # Check if .env file exists
    if os.path.exists('.env'):
        load_dotenv()
        api_key = os.getenv("GROQ_API_KEY")
        if api_key and api_key != "your_groq_api_key_here":
            print("✅ GROQ_API_KEY is already configured!")
            return True
        else:
            print("⚠️  GROQ_API_KEY not found or not set properly.")
    else:
        print("⚠️  No .env file found.")
    
    print("\n📋 Setup Instructions:")
    print("1. Go to https://console.groq.com/keys")
    print("2. Create a new API key")
    print("3. Create a .env file in the backend directory with:")
    print("   GROQ_API_KEY=your_actual_api_key_here")
    print("\n4. Test the setup by running:")
    print("   python test_groq_chatbot.py")
    
    return False

if __name__ == "__main__":
    setup_groq() 