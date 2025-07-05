
def should_play_music(heart_rate):
    try:
        hr = int(heart_rate)  # Convert string to int
        return hr > 100  # Play music if heart rate is too high
    except (ValueError, TypeError):
        return False
