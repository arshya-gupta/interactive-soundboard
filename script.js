// Function to make a GET request to the API
async function fetchSoundData(inputString) {
    try {
        const response = await fetch(`https://frequency-generator.onrender.com/randomSound?inputString=${inputString}`);
        const data = await response.json();
        return data.soundData;
    } catch (error) {
        console.error('Error fetching sound data:', error);
        return null;
    }
}

// Function to play sound frequencies
function playSound(frequencies) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';

    const firstFrequency = parseFloat(frequencies[0]);
    if (!isNaN(firstFrequency) && isFinite(firstFrequency)) {
        oscillator.frequency.setValueAtTime(firstFrequency, audioContext.currentTime);

        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        oscillator.connect(gainNode);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);

        const frequencyDisplay = document.getElementById('frequencyDisplay');
        frequencyDisplay.textContent = `Frequencies: ${frequencies.join(', ')}`;
    } else {
        console.error('Invalid frequency value:', firstFrequency);
    }
}

async function handleButtonClick(char) {
    const soundData = await fetchSoundData(char);
    console.log('Received sound data:', soundData);
    if (soundData) {
        console.log(`Playing sound for ${char}:`, soundData);
        playSound(soundData);
    } else {
        console.error(`Error fetching sound data for ${char}`);
    }
}


// Create buttons for each letter of the alphabet
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
for (const char of alphabet) {
    const button = document.createElement('button');
    button.textContent = char;
    button.addEventListener('click', () => handleButtonClick(char));
    document.getElementById('buttonContainer').appendChild(button);
}

