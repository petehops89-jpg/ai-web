'use client';

import { useState } from 'react';

export default function Home() {
  const [mode, setMode] = useState<'chat' | 'image'>('chat');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error occurred' }]);
    }
    
    setLoading(false);
  };

  const generateImage = () => {
    if (!imagePrompt.trim()) return;
    setLoading(true);
    
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?safe=false&nologo=true&width=1024&height=1024&enhance=true`;
    setGeneratedImage(url);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', textAlign: 'center' }}>
          AI Web
        </h1>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' }}>
          <button
            onClick={() => setMode('chat')}
            style={{
              padding: '12px 30px',
              background: mode === 'chat' ? '#6366f1' : '#333',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Chat
          </button>
          <button
            onClick={() => setMode('image')}
            style={{
              padding: '12px 30px',
              background: mode === 'image' ? '#6366f1' : '#333',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Image Generator
          </button>
        </div>

        {mode === 'chat' ? (
          <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px' }}>
            <div style={{ height: '500px', overflowY: 'auto', marginBottom: '20px' }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: '15px',
                    padding: '12px',
                    background: msg.role === 'user' ? '#2563eb' : '#333',
                    borderRadius: '8px',
                    maxWidth: '80%',
                    marginLeft: msg.role === 'user' ? 'auto' : '0'
                  }}
                >
                  <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
                  <div style={{ marginTop: '5px' }}>{msg.content}</div>
                </div>
              ))}
              {loading && (
                <div style={{ padding: '12px', background: '#333', borderRadius: '8px', maxWidth: '80%' }}>
                  AI is typing...
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#333',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                style={{
                  padding: '12px 30px',
                  background: '#6366f1',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px'
                }}
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <input
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && generateImage()}
                placeholder="Describe the image you want to generate..."
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#333',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  marginBottom: '10px'
                }}
              />
              <button
                onClick={generateImage}
                disabled={loading}
                style={{
                  padding: '12px 30px',
                  background: '#6366f1',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  width: '100%'
                }}
              >
                Generate Image
              </button>
            </div>
            
            {generatedImage && (
              <div style={{ textAlign: 'center' }}>
                <img
                  src={generatedImage}
                  alt="Generated"
                  style={{ maxWidth: '100%', borderRadius: '12px' }}
                  onLoad={() => setLoading(false)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
