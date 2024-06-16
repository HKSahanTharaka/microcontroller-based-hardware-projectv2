// DOM Elements
const leftMatTotal = document.getElementById('leftMatTotal');
const rightMatTotal = document.getElementById('rightMatTotal');
const marker = document.querySelector('.marker');
const spineCurveImage = document.getElementById('spineCurveImage');
const sensor1ValueElement = document.getElementById('sensor1Value');
const sensor2ValueElement = document.getElementById('sensor2Value');

// WebSocket connection
const socket = new WebSocket('ws://192.168.172.188/ws');

// Event listener for WebSocket connection open
socket.onopen = function(event) {
  console.log('WebSocket connection established.');
};

// Event listener for WebSocket messages
socket.onmessage = function(event) {
  const data = JSON.parse(event.data);
  
  // Update sensor values in UI
  sensor1ValueElement.textContent = data.sensor1;
  sensor2ValueElement.textContent = data.sensor2;

  // Check sensor limits and update spine curve border
  checkSensorLimits();
};

// Function to calculate total weight based on mat data points
function calculateTotalWeight(matId) {
    const mat = document.getElementById(matId);
    let totalWeight = 0;

    // Loop through each point inside the mat
    mat.querySelectorAll('.point').forEach(point => {
        const value = parseInt(point.getAttribute('data-point'));
        totalWeight += value;
    });

    return totalWeight;
}

// Function to check sensor values against their ranges
function checkSensorLimits() {
    const sensor1Value = parseInt(sensor1ValueElement.textContent);
    const sensor2Value = parseInt(sensor2ValueElement.textContent);
    const sensor1Range = document.getElementById('sensor1Range').textContent.split('-').map(Number);
    const sensor2Range = document.getElementById('sensor2Range').textContent.split('-').map(Number);

    const isSensor1Exceeding = sensor1Value < sensor1Range[0] || sensor1Value > sensor1Range[1];
    const isSensor2Exceeding = sensor2Value < sensor2Range[0] || sensor2Value > sensor2Range[1];

    if (isSensor1Exceeding || isSensor2Exceeding) {
        spineCurveImage.classList.add('flashing-border');
    } else {
        spineCurveImage.classList.remove('flashing-border');
    }
}

// Simulated Data Updates (for demonstration purposes)
setInterval(() => {
    // Update Mats Total Weight (simulated data)
    const leftWeight = calculateTotalWeight('leftMat');
    const rightWeight = calculateTotalWeight('rightMat');
    
    leftMatTotal.textContent = leftWeight;
    rightMatTotal.textContent = rightWeight;
    
    // Update Marker Position based on Mat Weights
    updateMarkerPosition(leftWeight, rightWeight);
    
    // Update BPM (simulated data)
    const newBPM = Math.floor(Math.random() * 100);
    document.getElementById('bpmText').textContent = `BPM: ${newBPM}`;

    // Check sensor limits and update spine curve border
    checkSensorLimits();
}, 2000);  // Update every 2 seconds (for demonstration purposes)

// Function to update marker position based on mat weights
function updateMarkerPosition(leftWeight, rightWeight) {
    const totalWeight = leftWeight + rightWeight;
    const barWidth = document.querySelector('.bar').offsetWidth;

    if (totalWeight === 0 || leftWeight === rightWeight) {
        marker.style.left = '50%'; // Center the marker if there's no weight or weights are equal
    } else {
        const offset = ((rightWeight - leftWeight) / totalWeight) * (barWidth / 2) * 2; // Calculate offset with 2x sensitivity
        const markerPosition = 50 + offset / barWidth * 100; // Calculate marker position in percentage
        marker.style.left = `${markerPosition}%`;
    }
}

// Function to open Threshold Modal
function openThresholdModal() {
    $('#warningPopup').modal('show');
}

// Function to save Threshold Changes
function saveThreshold() {
    const newThresholdValue = document.getElementById('thresholdInput').value;
    // Perform logic to save threshold changes
    console.log('New Threshold Value:', newThresholdValue);

    // Update threshold values in UI
    document.getElementById('thresholdValue').textContent = newThresholdValue;

    // Close modal after saving changes (for demonstration)
    $('#warningPopup').modal('hide');
}

// Function to open Sensor Ranges Modal
function openSensorRangesModal() {
    $('#changeSensorRangesPopup').modal('show');
}

// Function to save Sensor Ranges Changes
function saveSensorRanges() {
    const sensor1RangeInput = document.getElementById('sensor1RangeInput').value;
    const sensor2RangeInput = document.getElementById('sensor2RangeInput').value;
    // Perform logic to save sensor ranges changes
    console.log('Sensor 1 Range:', sensor1RangeInput);
    console.log('Sensor 2 Range:', sensor2RangeInput);

    // Update sensor range values in UI
    document.getElementById('sensor1Range').textContent = sensor1RangeInput;
    document.getElementById('sensor2Range').textContent = sensor2RangeInput;

    // Close modal after saving changes (for demonstration)
    $('#changeSensorRangesPopup').modal('hide');
}

// Event listeners for buttons
document.getElementById('changeThresholdBtn').addEventListener('click', openThresholdModal);
document.getElementById('changeSensorRangesBtn').addEventListener('click', openSensorRangesModal);

// Example: Activate buzzer manually for testing
document.getElementById('activateBuzzerButton').addEventListener('click', () => {
    activateBuzzer();
});

// Example: Function to activate buzzer (to be implemented as per your application)
function activateBuzzer() {
    // Implement buzzer activation logic here, e.g., send command to ESP32
    console.log('Buzzer activated!');
}
