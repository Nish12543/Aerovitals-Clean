import requests
import time

def preload_model():
    """Pre-load the model into memory for faster responses."""
    OLLAMA_API_URL = "http://localhost:11434/api/generate"
    OLLAMA_MODEL = "mistral:latest"
    
    print("🔄 Pre-loading model into memory...")
    
    # Send a simple request to load the model
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": "Hello",
        "stream": False,
        "options": {
            "num_predict": 10
        }
    }
    
    try:
        start_time = time.time()
        response = requests.post(OLLAMA_API_URL, json=payload)
        end_time = time.time()
        
        if response.status_code == 200:
            print(f"✅ Model loaded successfully in {end_time - start_time:.2f} seconds")
            print("🚀 Subsequent requests should be much faster!")
        else:
            print(f"❌ Error loading model: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

if __name__ == "__main__":
    preload_model() 