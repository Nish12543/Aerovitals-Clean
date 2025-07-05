from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import get_chatbot_response  # Ensure this imports the correct function
from music import should_play_music  # Ensure this imports the correct function
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Load models and encoders
sleep_model = joblib.load('sleep_disorder_pred_v2.pkl')
stress_model = joblib.load('stress_level_pred_v2.pkl')

# Load label encoders if they exist
try:
    sleep_le = joblib.load('sleep_disorder_label_encoder.pkl')
except:
    sleep_le = None

try:
    stress_le = joblib.load('stress_level_label_encoder.pkl')
except:
    stress_le = None

@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information."""
    return jsonify({
        'message': 'Aerovitals API is running',
        'endpoints': {
            'health': '/health',
            'chat': '/chat',
            'heartrate': '/heartrate',
            'predict_sleep_disorder': '/predict_sleep_disorder',
            'predict_stress_level': '/predict_stress_level'
        },
        'status': 'healthy'
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for deployment monitoring."""
    return jsonify({'status': 'healthy', 'message': 'Aerovitals API is running'})

@app.route('/chat', methods=['POST'])
def chat():
    if request.json is not None:
        user_input = request.json.get('message', '')  # Get the message sent by the user
    else:
        user_input = ''
    response = get_chatbot_response(user_input)  # Get the chatbot's response
    return jsonify({'response': response})  # Return the response as JSON

@app.route('/heartrate', methods=['POST'])
def heart_rate():
    if request.json is not None:
        hr = request.json.get('heart_rate')  # Get the heart rate
    else:
        hr = None
    play_music = should_play_music(hr)  # Check if we need to play calming music
    return jsonify({'play_music': play_music})  # Return the result

@app.route('/predict_sleep_disorder', methods=['POST'])
def predict_sleep_disorder():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Define expected columns for sleep disorder prediction
        expected_columns = [
            'Age', 'Gender', 'Occupation', 'Sleep Duration', 'Quality of Sleep',
            'Physical Activity Level', 'Stress Level', 'BMI Category', 'Blood Pressure',
            'Heart Rate', 'Daily Steps', 'Sleep Disorder'
        ]
        
        # Check for missing columns and provide defaults
        for col in expected_columns:
            if col not in data:
                if col == 'Blood Pressure':
                    data[col] = 'Normal'  # Default value
                elif col == 'BMI Category':
                    data[col] = 'Normal Weight'
                elif col == 'Gender':
                    data[col] = 'Male'
                elif col == 'Occupation':
                    data[col] = 'Software Engineer'
                elif col == 'Sleep Disorder':
                    data[col] = 'None'
                else:
                    data[col] = 0  # Default numeric value
        
        X = pd.DataFrame([data])
        pred = sleep_model.predict(X)[0]
        
        if sleep_le:
            pred = sleep_le.inverse_transform([pred])[0]
        
        if hasattr(pred, 'item'):
            pred = pred.item()
        pred = str(pred)
        
        return jsonify({'prediction': pred})
        
    except Exception as e:
        print(f"Error in sleep disorder prediction: {str(e)}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/predict_stress_level', methods=['POST'])
def predict_stress_level():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Define expected columns for stress level prediction
        expected_columns = [
            'Age', 'Gender', 'Occupation', 'Sleep Duration', 'Quality of Sleep',
            'Physical Activity Level', 'Stress Level', 'BMI Category', 'Blood Pressure',
            'Heart Rate', 'Daily Steps', 'Sleep Disorder'
        ]
        
        # Check for missing columns and provide defaults
        for col in expected_columns:
            if col not in data:
                if col == 'Blood Pressure':
                    data[col] = 'Normal'  # Default value
                elif col == 'BMI Category':
                    data[col] = 'Normal Weight'
                elif col == 'Gender':
                    data[col] = 'Male'
                elif col == 'Occupation':
                    data[col] = 'Software Engineer'
                elif col == 'Sleep Disorder':
                    data[col] = 'None'
                else:
                    data[col] = 0  # Default numeric value
        
        X = pd.DataFrame([data])
        pred = stress_model.predict(X)[0]
        
        if stress_le:
            pred = stress_le.inverse_transform([pred])[0]
        
        if hasattr(pred, 'item'):
            pred = pred.item()
        pred = str(pred)
        
        return jsonify({'prediction': pred})
        
    except Exception as e:
        print(f"Error in stress level prediction: {str(e)}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
