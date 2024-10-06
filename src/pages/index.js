import { Button, Container, Text, Title, Group } from '@mantine/core';
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { IconLock, IconMenu2, IconX } from '@tabler/icons-react';

export default function Home() {
  const fileInputRef = useRef(null);
  const router = useRouter();
  const [showInfo, setShowInfo] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleBrowseFiles = () => {
    fileInputRef.current.click(); // Open hidden file input
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file); // Create object URL for the file
      router.push({
        pathname: '/cutter',
        query: { file: fileUrl },
      });
    }
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle the sidebar open/close state
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', position: 'relative' }}>
      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '300px',
          backgroundColor: '#1e1e1e',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-300px)',
          transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Smooth elastic effect
          zIndex: 1000,
          boxShadow: sidebarOpen ? '5px 0 15px rgba(0, 0, 0, 0.3)' : 'none',
          padding: '20px',
        }}
      >
        <Button
          variant="outline"
          onClick={toggleSidebar}
          style={{
            backgroundColor: 'transparent',
            color: '#fff',
            border: 'none',
            position: 'absolute',
            top: '20px',
            right: '-50px',
            fontSize: '1.5rem',
            transform: sidebarOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          <IconX size={32} />
        </Button>

        <Text style={{ color: '#fff', marginBottom: '40px', fontSize: '1.5rem', fontWeight: 600 }}>
          <strong>Menu</strong>
        </Text>

        <Text
          component="a"
          href="#"
          style={{
            color: '#ddd',
            display: 'block',
            fontSize: '1.2rem',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            transition: 'color 0.3s ease-in-out',
          }}
          onMouseEnter={(e) => (e.target.style.color = '#6D5FFD')}
          onMouseLeave={(e) => (e.target.style.color = '#ddd')}
        >
          Remover
        </Text>
        <Text
          component="a"
          href="#"
          style={{
            color: '#ddd',
            display: 'block',
            fontSize: '1.2rem',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            transition: 'color 0.3s ease-in-out',
          }}
          onMouseEnter={(e) => (e.target.style.color = '#6D5FFD')}
          onMouseLeave={(e) => (e.target.style.color = '#ddd')}
        >
          Splitter
        </Text>
        <Text
          component="a"
          href="#"
          style={{
            color: '#ddd',
            display: 'block',
            fontSize: '1.2rem',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            transition: 'color 0.3s ease-in-out',
          }}
          onMouseEnter={(e) => (e.target.style.color = '#6D5FFD')}
          onMouseLeave={(e) => (e.target.style.color = '#ddd')}
        >
          Pitcher
        </Text>
        <Text
          component="a"
          href="#"
          style={{
            color: '#ddd',
            display: 'block',
            fontSize: '1.2rem',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            transition: 'color 0.3s ease-in-out',
          }}
          onMouseEnter={(e) => (e.target.style.color = '#6D5FFD')}
          onMouseLeave={(e) => (e.target.style.color = '#ddd')}
        >
          Key BPM Finder
        </Text>
        <Text
          component="a"
          href="#"
          style={{
            color: '#ddd',
            display: 'block',
            fontSize: '1.2rem',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            transition: 'color 0.3s ease-in-out',
          }}
          onMouseEnter={(e) => (e.target.style.color = '#6D5FFD')}
          onMouseLeave={(e) => (e.target.style.color = '#ddd')}
        >
          Joiner
        </Text>
        <Text
          component="a"
          href="#"
          style={{
            color: '#ddd',
            display: 'block',
            fontSize: '1.2rem',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            transition: 'color 0.3s ease-in-out',
          }}
          onMouseEnter={(e) => (e.target.style.color = '#6D5FFD')}
          onMouseLeave={(e) => (e.target.style.color = '#ddd')}
        >
          Support
        </Text>
      </div>

      {/* Page Content */}
      <Container
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: '#000',
          color: '#fff',
          padding: '20px',
        }}
      >
        {/* Sidebar Toggle Button */}
        <Button
          onClick={toggleSidebar}
          variant="outline"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'transparent',
            border: '2px solid #6D5FFD',
            color: '#6D5FFD',
            padding: '10px',
            borderRadius: '50%',
            transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
            zIndex: 1100,
            '&:hover': {
              backgroundColor: '#6D5FFD',
              color: '#fff',
              borderColor: '#fff',
            },
          }}
        >
          <IconMenu2 size={24} />
        </Button>

        <Title order={1} style={{ fontSize: '3rem', margin: '20px 0', color: '#fff' }}>
          Audio Cutter
        </Title>
        <h2>
          <Text size="lg" style={{ marginBottom: '20px', color: '#aaa' }}>
            Free editor to trim and cut any audio file online
          </Text>
        </h2>

        <Button
          radius="xl"
          size="lg"
          onClick={handleBrowseFiles}
          styles={{
            root: {
              backgroundColor: 'transparent',
              color: '#fff',
              border: '2px solid #6D5FFD',
              borderRadius: '50px',
              padding: '20px 60px', // Increased button size
              fontWeight: 600,
              fontSize: '1.2rem', // Increased font size for better appearance
              transition: 'border-color 0.3s ease, color 0.3s ease, background-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#4FD1C5',
                borderColor: '#4FD1C5',
                color: '#000',
              },
              '&:active': {
                backgroundColor: '#6D5FFD',
                borderColor: '#6D5FFD',
                color: '#fff',
              },
            },
          }}
        >
          Browse my files
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          accept="audio/*"
          onChange={handleFileChange}
        />

        {/* Toggle How it Works Section */}
        <h3>
        <Text
          onClick={toggleInfo}
          style={{ cursor: 'pointer', color: '#4FD1C5', marginTop: '40px', fontSize: '1.2rem' }}
        >
          How it Works
        </Text>
        </h3>

        {showInfo && (
          <div style={{ marginTop: '40px', textAlign: 'left', opacity: showInfo ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}>
            <h3><Text size="lg" style={{ color: '#aaa', marginBottom: '20px' }}>
              This app can be used to trim and/or cut audio tracks, remove audio fragments. Fade in
              and fade out your music easily to make the audio harmoniously.
            </Text>
            </h3>
            <h3>
            <Text size="lg" style={{ color: '#aaa', marginBottom: '20px' }}>
              It's fast and easy to use. You can save the audio file in any format (codec parameters
              are configured).
            </Text>
            </h3>
            <h3>
            <Text size="lg" style={{ color: '#aaa', marginBottom: '20px' }}>
              It works directly in the browser, no need to install any software, and is available
              for mobile devices.
            </Text>
            </h3>

            {/* Privacy and Security Section */}
            <Group spacing="xs" style={{ marginTop: '30px' }}>
              <IconLock size={24} style={{ color: '#4FD1C5' }} />
              <h3>
              <Text size="lg" weight={500} style={{ color: '#fff' }}>
                Privacy and Security Guaranteed
              </Text>
              </h3>
            </Group>
            <h3><Text size="lg" style={{ color: '#aaa' }}>
              This is a serverless app. Your files do not leave your device.
            </Text>
            </h3>
            
          </div>
        )}
      </Container>
    </div>
  );
}
