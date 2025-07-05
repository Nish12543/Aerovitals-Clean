#!/usr/bin/env bash 
# Build script for Render deployment 
 
# Install system dependencies for PyAudio 
apt-get update 
apt-get install -y portaudio19-dev python3-pyaudio 
 
pip install -r requirements.txt 
