/**
 * WaveformGenerator - Handles waveform generation for oscilloscope channels
 */
class WaveformGenerator {
    constructor() {
        this.customWaveform = null;
        this.presetCh1 = null;
        this.presetCh2 = null;
    }

    /**
     * Generate waveform data points for a channel
     * @param {string} channel - 'ch1' or 'ch2'
     * @param {Object} ch - Channel configuration
     * @param {number} time - Current time
     * @param {number} timeSpan - Time span for one screen width
     * @param {number} samples - Number of samples to generate
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     * @returns {string} SVG path data
     */
    generateWaveform(channel, ch, time, timeSpan, samples, canvasWidth, canvasHeight) {
        const points = [];
        const centerY = canvasHeight / 2;

        for (let i = 0; i < samples; i++) {
            const x = (i / samples) * canvasWidth;
            const t = time + ((i / samples) * (timeSpan / 1000000)); // Use actual time for animation
            let y = this.generateSample(channel, ch, t);
            const pixelY = centerY - (y * ch.amplitude * 50); // Scale amplitude
            points.push(`${x},${pixelY}`);
        }
        
        return `M ${points.join(' L ')}`;
    }    /**
     * Generate a single sample for the given channel and time
     * @param {string} channel - 'ch1' or 'ch2'
     * @param {Object} ch - Channel configuration
     * @param {number} t - Time value
     * @returns {number} Sample value
     */
    generateSample(channel, ch, t) {
        const phase = (ch.phase * Math.PI) / 180;

        switch (ch.wave) {
            case 'sine':
                return Math.sin(2 * Math.PI * ch.frequency * t + phase);

            case 'square':
                return Math.sin(2 * Math.PI * ch.frequency * t + phase) > 0 ? 1 : -1;

            case 'triangle':
                const trianglePhase = (2 * Math.PI * ch.frequency * t + phase) % (2 * Math.PI);
                return trianglePhase < Math.PI ?
                    -1 + (2 * trianglePhase / Math.PI) :
                    3 - (2 * trianglePhase / Math.PI);

            case 'sawtooth':
                const sawPhase = (2 * Math.PI * ch.frequency * t + phase) % (2 * Math.PI);
                return -1 + (sawPhase / Math.PI);

            case 'noise':
                return (Math.random() - 0.5) * 2;

            case 'custom':
                if (channel === 'ch1' && this.presetCh1) {
                    return this.presetCh1(t, ch);
                } else if (channel === 'ch2' && this.presetCh2) {
                    return this.presetCh2(t, ch);
                } else if (this.customWaveform) {
                    try {
                        return this.customWaveform(t, ch);
                    } catch(e) {
                        console.warn('Invalid custom function:', e);
                        return 0;
                    }
                }
                return 0;

            default:
                return 0;
        }
    }

    /**
     * Set custom waveform function
     * @param {Function} func - Custom waveform function
     */
    setCustomWaveform(func) {
        this.customWaveform = func;
    }

    /**
     * Set preset functions for channels
     * @param {Function} ch1Func - CH1 preset function
     * @param {Function} ch2Func - CH2 preset function
     */
    setPresetFunctions(ch1Func, ch2Func) {
        this.presetCh1 = ch1Func;
        this.presetCh2 = ch2Func;
    }
}
