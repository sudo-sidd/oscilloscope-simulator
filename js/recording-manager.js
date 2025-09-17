/**
 * RecordingManager - Handles recording and playback of oscilloscope patterns
 */
class RecordingManager {
    constructor(oscilloscope) {
        this.scope = oscilloscope;
    }

    /**
     * Start recording current oscilloscope state
     */
    startRecording() {
        this.scope.recording.isRecording = true;
        this.scope.recording.startTime = performance.now() / 1000;
        this.scope.recording.data = [];
        document.getElementById('record-status').textContent = 'Recording...';
        document.getElementById('record-btn').style.background = '#ff0000';
        document.getElementById('record-btn').textContent = '⏺ RECORDING';
    }

    /**
     * Stop recording and save the pattern
     */
    stopRecording() {
        if (!this.scope.recording.isRecording) return;

        this.scope.recording.isRecording = false;
        const name = `Pattern_${new Date().toLocaleTimeString()}`;
        this.scope.recording.recordings.push({
            name: name,
            duration: this.scope.recording.duration,
            data: [...this.scope.recording.data]
        });

        // Update recording list
        this.scope.uiController.updateRecordingList();

        document.getElementById('record-status').textContent = `Saved: ${name}`;
        document.getElementById('record-btn').style.background = '#ff4444';
        document.getElementById('record-btn').textContent = '● REC';
    }

    /**
     * Play back a recorded pattern
     * @param {number} index - Index of recording to play
     */
    playRecording(index) {
        const recording = this.scope.recording.recordings[index];
        if (!recording) return;

        this.scope.recording.isPlaying = true;
        this.scope.recording.currentPlayback = recording;
        this.scope.recording.playbackStart = performance.now() / 1000;

        document.getElementById('record-status').textContent = `Playing: ${recording.name}`;
        document.getElementById('play-btn').style.background = '#00ff00';
        document.getElementById('play-btn').textContent = '⏸ PLAYING';
    }

    /**
     * Stop playback
     */
    stopPlayback() {
        this.scope.recording.isPlaying = false;
        this.scope.recording.currentPlayback = null;
        document.getElementById('record-status').textContent = 'Ready';
        document.getElementById('play-btn').style.background = '#44ff44';
        document.getElementById('play-btn').textContent = '▶ PLAY';
    }

    /**
     * Update recording data during recording
     */
    updateRecording() {
        if (!this.scope.recording.isRecording) return;

        const currentTime = performance.now() / 1000;
        this.scope.recording.duration = currentTime - this.scope.recording.startTime;
        document.getElementById('record-duration').textContent = this.scope.recording.duration.toFixed(1) + 's';

        // Store current state
        this.scope.recording.data.push({
            time: this.scope.recording.duration,
            ch1: {
                wave: this.scope.channels.ch1.wave,
                frequency: this.scope.channels.ch1.frequency,
                amplitude: this.scope.channels.ch1.amplitude,
                phase: this.scope.channels.ch1.phase,
                enabled: this.scope.channels.ch1.enabled
            },
            ch2: {
                wave: this.scope.channels.ch2.wave,
                frequency: this.scope.channels.ch2.frequency,
                amplitude: this.scope.channels.ch2.amplitude,
                phase: this.scope.channels.ch2.phase,
                enabled: this.scope.channels.ch2.enabled
            },
            timeBase: this.scope.timeBase,
            triggerLevel: this.scope.triggerLevel
        });
    }

    /**
     * Update playback state during playback
     */
    updatePlayback() {
        if (!this.scope.recording.isPlaying || !this.scope.recording.currentPlayback) return;

        const playTime = performance.now() / 1000 - this.scope.recording.playbackStart;
        const frame = this.scope.recording.currentPlayback.data.find(d => Math.abs(d.time - playTime) < 0.1);

        if (frame) {
            // Apply recorded settings
            this.scope.channels.ch1 = { ...frame.ch1 };
            this.scope.channels.ch2 = { ...frame.ch2 };
            this.scope.timeBase = frame.timeBase;
            this.scope.triggerLevel = frame.triggerLevel;

            // Update UI to reflect playback
            this.scope.uiController.updateUIFromState();
        } else if (playTime > this.scope.recording.currentPlayback.duration) {
            // End of playback
            this.stopPlayback();
        }
    }
}
