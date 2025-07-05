import React from 'react';

export default function MusicPlayer() {
  return (
    <div>
      <audio controls autoPlay loop>
        <source src="/calm.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
