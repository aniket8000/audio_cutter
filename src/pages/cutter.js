import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import WaveSurfer from 'wavesurfer.js';
import { Button, Container, Slider, Text, Title, Group } from '@mantine/core';

export default function Cutter() {
  const router = useRouter();
  const waveformRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    const { file } = router.query;
    let audioUrl;

    if (file instanceof File) {
      audioUrl = URL.createObjectURL(file);
    } else if (typeof file === 'string') {
      audioUrl = file;
    } else {
      console.error('No valid file or URL found');
      return;
    }

    if (audioUrl && waveformRef.current) {
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#97CEEC',
        progressColor: '#4FD1C5',
        cursorColor: '#fff',
        height: 100,
        responsive: true,
        barWidth: 2,
      });

      waveSurferRef.current.load(audioUrl);

      waveSurferRef.current.on('ready', () => {
        const audioDuration = waveSurferRef.current.getDuration();
        setDuration(audioDuration);
        setEndTime(audioDuration);
        setAudioLoaded(true);
      });

      waveSurferRef.current.on('error', (error) => {
        console.error('Error loading audio:', error);
        setError('Failed to load audio file. Please try again.');
      });

      return () => {
        waveSurferRef.current.destroy();
        if (file instanceof File) {
          URL.revokeObjectURL(audioUrl);
        }
      };
    }
  }, [router.query]);

  const togglePlayPause = () => {
    if (waveSurferRef.current) {
      waveSurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const trimAudio = async () => {
    const start = prompt('Enter the start time in seconds:', startTime.toFixed(2));
    const end = prompt('Enter the end time in seconds:', endTime.toFixed(2));

    if (start === null || end === null) return;

    const startTimeFloat = parseFloat(start);
    const endTimeFloat = parseFloat(end);

    if (isNaN(startTimeFloat) || isNaN(endTimeFloat) || startTimeFloat < 0 || endTimeFloat > duration || startTimeFloat >= endTimeFloat) {
      alert('Invalid start or end time. Please try again.');
      return;
    }

    const audioUrl = waveSurferRef.current.backend.getAudioBuffer();
    const offlineContext = new OfflineAudioContext(1, audioUrl.length, 44100);
    const source = offlineContext.createBufferSource();
    source.buffer = audioUrl;

    const trimmedBuffer = offlineContext.createBuffer(1, offlineContext.sampleRate * (endTimeFloat - startTimeFloat), offlineContext.sampleRate);
    trimmedBuffer.copyToChannel(audioUrl.getChannelData(0).slice(startTimeFloat * offlineContext.sampleRate, endTimeFloat * offlineContext.sampleRate), 0);

    const audioBlob = await exportAudio(offlineContext, trimmedBuffer);
    const trimmedAudioUrl = URL.createObjectURL(audioBlob);
    setDownloadUrl(trimmedAudioUrl);
  };

  const exportAudio = async (context, buffer) => {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
    return new Promise((resolve) => {
      context.startRendering().then((renderedBuffer) => {
        const wavBlob = bufferToWave(renderedBuffer, renderedBuffer.length);
        resolve(wavBlob);
      });
    });
  };

  const bufferToWave = (abuffer, len) => {
    const numOfChannels = abuffer.numberOfChannels;
    const length = len * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    for (let i = 0; i < numOfChannels; i++) {
      channels.push(abuffer.getChannelData(i));
    }
    writeWavHeader(view, len, numOfChannels);
    let offset = 44;
    for (let i = 0; i < len; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }
    return new Blob([buffer], { type: 'audio/wav' });
  };

  const writeWavHeader = (view, len, channels) => {
    view.setUint32(0, 1380533830, true); // RIFF
    view.setUint32(4, len * 2 + 36, true); // file length
    view.setUint32(8, 0x45564166, true); // WAVE
    view.setUint32(12, 0x20746d66, true); // fmt
    view.setUint32(16, 16, true); // length of fmt
    view.setUint16(20, 1, true); // format type
    view.setUint16(22, channels, true); // channel count
    view.setUint32(24, 44100, true); // sample rate
    view.setUint32(28, channels * 44100 * 2, true); // byte rate
    view.setUint16(32, channels * 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    view.setUint32(36, 0x61746164, true); // data
    view.setUint32(40, len * 2, true); // data length
  };

  return (
    <Container style={{ paddingTop: '40px', backgroundColor: '#000', minHeight: '100vh' }}>
      <Title align="center" style={{ color: '#4FD1C5', marginBottom: '20px' }}>
        Audio Cutter
      </Title>

      <div ref={waveformRef} style={{ marginBottom: '20px', backgroundColor: '#333', padding: '10px' }} />

      {error && (
        <Text color="red" align="center" style={{ marginBottom: '20px' }}>
          {error}
        </Text>
      )}

      {audioLoaded && (
        <>
          <Group position="center" style={{ marginBottom: '20px' }}>
            <Text color="white" style={{ marginRight: '10px' }}>Start: {startTime.toFixed(2)} sec</Text>
            <Text color="white">End: {endTime.toFixed(2)} sec</Text>
          </Group>

          <Text color="white" align="center" style={{ marginBottom: '5px' }}>Adjust Start Time</Text>
          <Slider
            value={startTime}
            onChange={(value) => setStartTime(value)}
            min={0}
            max={endTime}
            step={0.01}
            color="green"
            style={{ marginBottom: '20px' }}
          />

          <Text color="white" align="center" style={{ marginBottom: '5px' }}>Adjust End Time</Text>
          <Slider
            value={endTime}
            onChange={(value) => setEndTime(value)}
            min={startTime}
            max={duration}
            step={0.01}
            color="blue"
            style={{ marginBottom: '20px' }}
          />

          {/* Control Buttons */}
          <Group position="center" style={{ marginTop: '20px', flexDirection: 'column', alignItems: 'center' }}>
            <Group direction="column" position="center" spacing="xs" style={{ width: '100%', maxWidth: '200px', textAlign: 'center' }}>
              <Button 
                color="teal" 
                onClick={togglePlayPause} 
                style={{
                  borderRadius: '20px',
                  height: '50px',
                  fontSize: '18px',
                  transition: 'background-color 0.3s, transform 0.2s',
                  width: '100%', // Ensure buttons take full width of the parent group
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2a9d8f';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }} 
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>

              {downloadUrl && (
                <a href={downloadUrl} download="trimmed-audio.wav">
                  <Button 
                    color="blue" 
                    style={{
                      borderRadius: '20px',
                      height: '50px',
                      fontSize: '18px',
                      transition: 'background-color 0.3s, transform 0.2s',
                      width: '100%', // Ensure buttons take full width of the parent group
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1d68a8';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }} 
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Download Trimmed Audio
                  </Button>
                </a>
              )}
            </Group>

            <Button 
              color="green" 
              onClick={trimAudio} 
              style={{
                borderRadius: '20px',
                height: '50px',
                fontSize: '18px',
                transition: 'background-color 0.3s, transform 0.2s',
                width: '100%', // Ensure buttons take full width of the parent group
                marginTop: '20px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1e8e5f';
                e.currentTarget.style.transform = 'scale(1.05)';
              }} 
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Trim Audio
            </Button>

            <Button 
              onClick={() => router.push('/')} 
              style={{
                borderRadius: '20px',
                height: '50px',
                fontSize: '18px',
                transition: 'background-color 0.3s, transform 0.2s',
                width: '100%', // Ensure buttons take full width of the parent group
                marginTop: '10px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9c74f';
                e.currentTarget.style.transform = 'scale(1.05)';
              }} 
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Back to Upload
            </Button>
          </Group>
        </>
      )}
    </Container>
  );
}
