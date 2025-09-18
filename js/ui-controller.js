/**
 * UIController - Handles UI updates and event listeners
 */
class UIController {
    constructor(oscilloscope) {
        this.scope = oscilloscope;
        this.timeBaseValues = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, 100000000];
    }

    /**
     * Initialize all event listeners
     */
    setupEventListeners() {
        this.setupChannelControls();
        this.setupWaveformControls();
        this.setupTimeAndTriggerControls();
        this.setupCustomControls();
        this.setupWindowResize();
    }

    setupChannelControls() {
        // Channel buttons
        document.getElementById('ch1-btn').addEventListener('click', () => {
            this.scope.channels.ch1.enabled = !this.scope.channels.ch1.enabled;
            this.updateChannelButtons();
        });

        document.getElementById('ch2-btn').addEventListener('click', () => {
            this.scope.channels.ch2.enabled = !this.scope.channels.ch2.enabled;
            this.updateChannelButtons();
        });
    }

    setupWaveformControls() {
        // CH1 controls
        document.getElementById('ch1-wave').addEventListener('change', (e) => {
            this.scope.channels.ch1.wave = e.target.value;
        });

        document.getElementById('ch1-freq-slider').addEventListener('input', (e) => {
            this.scope.channels.ch1.frequency = parseInt(e.target.value);
            document.getElementById('ch1-freq-val').textContent = e.target.value + ' Hz';
        });

        document.getElementById('ch1-amp-slider').addEventListener('input', (e) => {
            this.scope.channels.ch1.amplitude = parseFloat(e.target.value);
            document.getElementById('ch1-amp-val').textContent = e.target.value + ' V';
        });

        document.getElementById('ch1-phase-slider').addEventListener('input', (e) => {
            this.scope.channels.ch1.phase = parseInt(e.target.value);
            document.getElementById('ch1-phase-val').textContent = e.target.value + '°';
        });

        // CH2 controls
        document.getElementById('ch2-wave').addEventListener('change', (e) => {
            this.scope.channels.ch2.wave = e.target.value;
        });

        document.getElementById('ch2-freq-slider').addEventListener('input', (e) => {
            this.scope.channels.ch2.frequency = parseInt(e.target.value);
            document.getElementById('ch2-freq-val').textContent = e.target.value + ' Hz';
        });

        document.getElementById('ch2-amp-slider').addEventListener('input', (e) => {
            this.scope.channels.ch2.amplitude = parseFloat(e.target.value);
            document.getElementById('ch2-amp-val').textContent = e.target.value + ' V';
        });

        document.getElementById('ch2-phase-slider').addEventListener('input', (e) => {
            this.scope.channels.ch2.phase = parseInt(e.target.value);
            document.getElementById('ch2-phase-val').textContent = e.target.value + '°';
        });
    }

    setupTimeAndTriggerControls() {
        document.getElementById('time-base-slider').addEventListener('input', (e) => {
            this.scope.timeBase = this.timeBaseValues[parseInt(e.target.value) - 1];
            this.updateTimeBaseDisplay();
        });

        document.getElementById('trigger-slider').addEventListener('input', (e) => {
            this.scope.triggerLevel = parseFloat(e.target.value);
            document.getElementById('trigger-val').textContent = e.target.value + ' V';
        });
    }

    setupCustomControls() {
                // Custom function editor
                document.getElementById('custom-function').addEventListener('input', (e) => {
                    try {
                        this.scope.waveformGenerator.setCustomWaveform(new Function('t', 'ch', e.target.value));
                    } catch(err) {
                        console.warn('Invalid custom function:', err);
                        this.scope.waveformGenerator.setCustomWaveform(null);
                    }
                });        // Animation presets
        document.getElementById('animation-presets').addEventListener('change', (e) => {
            this.applyPreset(e.target.value);
        });
    }

    setupWindowResize() {
        window.addEventListener('resize', () => {
            this.scope.init();
        });
    }

    /**
     * Update UI to reflect current state
     */
    updateUIFromState() {
        // Update waveform selects
        document.getElementById('ch1-wave').value = this.scope.channels.ch1.wave;
        document.getElementById('ch2-wave').value = this.scope.channels.ch2.wave;

        // Update frequency sliders and values
        document.getElementById('ch1-freq-slider').value = this.scope.channels.ch1.frequency;
        document.getElementById('ch2-freq-slider').value = this.scope.channels.ch2.frequency;
        document.getElementById('ch1-freq-val').textContent = this.scope.channels.ch1.frequency + ' Hz';
        document.getElementById('ch2-freq-val').textContent = this.scope.channels.ch2.frequency + ' Hz';

        // Update amplitude sliders and values
        document.getElementById('ch1-amp-slider').value = this.scope.channels.ch1.amplitude;
        document.getElementById('ch2-amp-slider').value = this.scope.channels.ch2.amplitude;
        document.getElementById('ch1-amp-val').textContent = this.scope.channels.ch1.amplitude + ' V';
        document.getElementById('ch2-amp-val').textContent = this.scope.channels.ch2.amplitude + ' V';

        // Update phase sliders and values
        document.getElementById('ch1-phase-slider').value = this.scope.channels.ch1.phase;
        document.getElementById('ch2-phase-slider').value = this.scope.channels.ch2.phase;
        document.getElementById('ch1-phase-val').textContent = this.scope.channels.ch1.phase + '°';
        document.getElementById('ch2-phase-val').textContent = this.scope.channels.ch2.phase + '°';

        // Update trigger
        document.getElementById('trigger-slider').value = this.scope.triggerLevel;
        document.getElementById('trigger-val').textContent = this.scope.triggerLevel + ' V';

        // Update channel buttons
        this.updateChannelButtons();

        // Update time base
        this.updateTimeBaseDisplay();
    }

    updateChannelButtons() {
        document.getElementById('ch1-btn').classList.toggle('active', this.scope.channels.ch1.enabled);
        document.getElementById('ch2-btn').classList.toggle('active', this.scope.channels.ch2.enabled);
    }

    updateTimeBaseDisplay() {
        let unit = 'μs';
        let value = this.scope.timeBase;
        if (value >= 1000000) {
            value /= 1000000;
            unit = 's';
        } else if (value >= 1000) {
            value /= 1000;
            unit = 'ms';
        }
        document.getElementById('time-base-val').textContent = value + ' ' + unit;
    }

    applyPreset(presetName) {
        const preset = this.scope.animationPresets[presetName];
        if (!preset) {
            document.getElementById('preset-description').innerHTML =
                'Select a preset to see description and optimal settings';
            return;
        }

        // Update description
        document.getElementById('preset-description').innerHTML =
            `<strong>${preset.name}</strong><br>${preset.description}`;

        // Set both channels to custom and apply preset functions
        this.scope.channels.ch1.wave = 'custom';
        this.scope.channels.ch2.wave = 'custom';
        document.getElementById('ch1-wave').value = 'custom';
        document.getElementById('ch2-wave').value = 'custom';

        // Enable both channels
        this.scope.channels.ch1.enabled = true;
        this.scope.channels.ch2.enabled = true;
        this.updateChannelButtons();

        // Apply ALL optimal settings
        this.scope.channels.ch1.frequency = preset.ch1Freq;
        this.scope.channels.ch2.frequency = preset.ch2Freq;
        this.scope.channels.ch1.amplitude = preset.ch1Amp;
        this.scope.channels.ch2.amplitude = preset.ch2Amp;
        this.scope.channels.ch1.phase = preset.ch1Phase;
        this.scope.channels.ch2.phase = preset.ch2Phase || 0;
        this.scope.triggerLevel = preset.triggerLevel;

        // Update ALL UI controls
        this.updateUIFromState();

        // Apply optimal timebase
        this.scope.timeBase = preset.timeBase;
        const timebaseIndex = this.timeBaseValues.indexOf(preset.timeBase);
        if (timebaseIndex >= 0) {
            document.getElementById('time-base-slider').value = timebaseIndex + 1;
            this.updateTimeBaseDisplay();
        }

        // Store preset functions
        this.scope.waveformGenerator.setPresetFunctions(preset.ch1, preset.ch2);

        // Update custom function display
        document.getElementById('custom-function').value =
            `// ${preset.name}: ${preset.description}\n// Optimized: ${preset.ch1Freq}Hz, ${preset.ch1Amp}V, ${preset.ch1Phase}° phase\n// Timebase: ${preset.timeBase/1000}ms/div, Trigger: ${preset.triggerLevel}V\n// Edit below to customize:\nreturn Math.sin(t * ch.frequency * 2 * Math.PI);`;

        console.log(`Applied preset: ${preset.name}`);
    }
}
