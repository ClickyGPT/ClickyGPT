
import React, { useState, useCallback } from 'react';
import QueryBuilder from './components/QueryBuilder.tsx';
import TerminalOutput from './components/TerminalOutput.tsx';
import { streamQuery } from './services/geminiService.ts';
import { Message, MessageAuthor } from './types.ts';
import { SYSTEM_INSTRUCTION } from './constants.ts';

// The logo is referenced from the provided URL.
const logoUrl = 'https://cdn.imgchest.com/files/avatar/wyevfxr387b.png';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      author: MessageAuthor.AI,
      text: `(•ヮ•) < ClickyGPT Interface online. Standing by for tactical query.`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuerySubmit = useCallback(async (queryData: { query: string; title: string }) => {
    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      author: MessageAuthor.User,
      text: queryData.query,
      title: queryData.title,
    };

    const aiMessageId = `ai-${Date.now()}`;
    const initialAiMessage: Message = {
        id: aiMessageId,
        author: MessageAuthor.AI,
        text: ''
    };

    setMessages(prev => [...prev, userMessage, initialAiMessage]);
    
    await streamQuery(
      queryData.query,
      SYSTEM_INSTRUCTION,
      (chunk) => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      },
      (err) => {
        setError(err);
        const errorMessage: Message = {
            id: `error-${Date.now()}`,
            author: MessageAuthor.System,
            text: err
        };
        setMessages(prev => [...prev.filter(m => m.id !== aiMessageId), errorMessage]);
      },
      () => {
        setIsLoading(false);
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 bg-grid-cyan-500/10 p-4 sm:p-6 lg:p-8">
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-0"></div>
       <main className="relative z-10 container mx-auto">
        <header className="flex items-center justify-center mb-8">
            <img src={logoUrl} alt="ClickyGPT Logo" className="w-20 h-20 mr-6" />
            <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-cyan-300 glow">
                    ClickyGPT
                </h1>
                <p className="text-cyan-400/80 mt-2 text-left">Channeling the ClickyGPT Edge</p>
            </div>
        </header>
        
        {error && (
            <div className="my-4 p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-md">
                <strong>System Error:</strong> {error}
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{height: 'calc(100vh - 12rem)'}}>
            <QueryBuilder onSubmit={handleQuerySubmit} isLoading={isLoading} />
            <TerminalOutput messages={messages} isLoading={isLoading} />
        </div>
        
        <footer className="text-center text-gray-600 text-xs mt-8">
            <p>Disconnect from the mundane. Engage with the signal.</p>
            <p>&copy; {new Date().getFullYear()} Clandestine Operations. All rights reserved... or are they?</p>
        </footer>
       </main>
    </div>
  );
};

export default App;
