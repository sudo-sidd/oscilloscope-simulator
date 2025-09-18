# Oscilloscope Simulator

A web-based oscilloscope simulator built with HTML, CSS, and JavaScript. This simulator allows you to visualize various waveforms, apply presets, and record/playback patterns.

## Features

- **Dual Channel Support**: CH1 and CH2 with independent controls
- **Multiple Waveforms**: Sine, square, triangle, sawtooth, noise, and custom functions
- **Animation Presets**: Pre-built complex patterns like Lissajous figures, heart curves, spirals, etc.
- **Real-time Controls**: Adjust frequency, amplitude, phase, time base, and trigger level
- **Responsive Design**: Works on different screen sizes

## Project Structure

```text
oscilloscope-simulator/
├── oscilloscope.html          # Main HTML file with embedded CSS and main JavaScript
├── js/
│   ├── waveform-generator.js  # Handles waveform generation logic
│   ├── ui-controller.js       # Manages UI updates and event listeners
│   └── grid-renderer.js       # Generates the oscilloscope grid
└── README.md                  # This file
```

## Architecture

The application is built using a modular architecture with separate classes for different responsibilities:

- **Oscilloscope**: Main coordinator class that manages the animation loop and coordinates modules
- **WaveformGenerator**: Generates waveform data points for different signal types
- **UIController**: Handles all user interface interactions and updates
- **GridRenderer**: Creates and renders the oscilloscope grid

## Usage

1. Open `oscilloscope.html` in a web browser
2. Use the controls on the right panel to adjust settings:
   - Channel buttons to enable/disable CH1 and CH2
   - Waveform selectors to choose signal types
   - Sliders for frequency, amplitude, and phase
   - Time base slider for horizontal scaling
   - Trigger level slider for vertical positioning
3. Try the animation presets from the dropdown menu

## Controls

### Channel Controls

- **CH1/CH2 Buttons**: Enable/disable channels
- **Waveform**: Select from sine, square, triangle, sawtooth, noise, or custom
- **Frequency**: Adjust signal frequency (1-5000 Hz)
- **Amplitude**: Adjust signal amplitude (0.1-5 V)
- **Phase**: Adjust signal phase (0-360°)

### Time and Trigger

- **Time/Div**: Adjust horizontal time scale
- **Trigger Level**: Set vertical trigger position (-5 to 5 V)

### Custom Functions

- Enter JavaScript expressions for custom waveforms
- Use variables: `t` (time), `ch` (channel properties)

### Animation Presets

- Pre-built complex patterns with optimized settings
- Includes Lissajous figures, parametric curves, fractals, etc.

## Technical Details

- **Rendering**: Uses SVG for crisp, scalable graphics
- **Animation**: 60fps animation loop using requestAnimationFrame
- **Waveform Generation**: Real-time calculation of 1000 samples per frame
- **Modular Design**: Clean separation of concerns for maintainability

## Browser Compatibility

Works in all modern browsers that support:

- ES6 classes
- SVG
- requestAnimationFrame
- Arrow functions

## Development

To modify or extend the simulator:

1. **WaveformGenerator**: Add new waveform types in `generateSample()`
2. **UIController**: Add new controls in `setupEventListeners()`
3. **GridRenderer**: Modify grid appearance
4. **Oscilloscope**: Main class for overall coordination

## License

This project is open source and available under the MIT License.
