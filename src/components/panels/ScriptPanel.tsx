import { useState } from 'react';
import { useStore } from '../../store';
import type { ChatMessage } from '../../types';

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function ScriptPanel() {
  const { messages, setMessages, addMessage, updateMessage, removeMessage, loadSampleConversation } = useStore();
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  const handleAddMessage = (role: 'user' | 'assistant') => {
    addMessage({
      id: generateId(),
      role,
      content: '',
      delayBefore: role === 'user' ? 800 : 400,
      stream: role === 'assistant',
      duration: role === 'assistant' ? 3000 : undefined,
    });
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        setJsonError('Must be a JSON array');
        return;
      }
      const msgs: ChatMessage[] = parsed.map((m: Record<string, unknown>) => ({
        id: generateId(),
        role: ((m.role as string) === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: (m.content as string) || '',
        delayBefore: (m.delayBefore as number) || 800,
        stream: m.stream !== undefined ? Boolean(m.stream) : m.role === 'assistant',
        duration: (m.duration as number) || 3000,
      }));
      setMessages(msgs);
      setJsonError('');
      setJsonMode(false);
    } catch {
      setJsonError('Invalid JSON format');
    }
  };

  const handleExportJson = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const exported = messages.map(({ id: _, ...rest }) => rest);
    setJsonText(JSON.stringify(exported, null, 2));
    setJsonMode(true);
  };

  return (
    <div className="space-y-4">
      {/* Sample conversations */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Sample Conversations
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => loadSampleConversation('demo1')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 transition-colors"
          >
            🧠 Neural Networks
          </button>
          <button
            onClick={() => loadSampleConversation('demo2')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 transition-colors"
          >
            📄 Summarization
          </button>
          <button
            onClick={() => loadSampleConversation('demo3')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 transition-colors"
          >
            💻 Code Generation
          </button>
        </div>
      </div>

      {/* Toggle JSON mode */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setJsonMode(false)}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${!jsonMode ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}
        >
          Visual Editor
        </button>
        <button
          onClick={() => { handleExportJson(); }}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${jsonMode ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}
        >
          JSON Editor
        </button>
      </div>

      {jsonMode ? (
        <div className="space-y-3">
          <textarea
            value={jsonText}
            onChange={(e) => { setJsonText(e.target.value); setJsonError(''); }}
            className="w-full h-64 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-xs font-mono text-gray-300 focus:border-indigo-500 focus:outline-none resize-none"
            placeholder='[{"role": "user", "content": "Hello"}]'
          />
          {jsonError && (
            <p className="text-xs text-red-400">{jsonError}</p>
          )}
          <button
            onClick={handleImportJson}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Import JSON
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Message list */}
          <div className="space-y-2 max-h-[calc(100vh-480px)] overflow-y-auto pr-1">
            {messages.map((msg, index) => (
              <div key={msg.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${msg.role === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                      {msg.role === 'user' ? 'USER' : 'ASSISTANT'}
                    </span>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                  <button
                    onClick={() => removeMessage(msg.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>

                <textarea
                  value={msg.content}
                  onChange={(e) => updateMessage(msg.id, { content: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none resize-none min-h-[60px]"
                  rows={3}
                  placeholder={msg.role === 'user' ? 'User message...' : 'Assistant response (supports **markdown**)...'}
                />

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-gray-500 uppercase">Delay (ms)</label>
                    <input
                      type="number"
                      value={msg.delayBefore || 800}
                      onChange={(e) => updateMessage(msg.id, { delayBefore: Number(e.target.value) })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-300 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  {msg.role === 'assistant' && (
                    <div className="flex-1">
                      <label className="text-[10px] text-gray-500 uppercase">Duration (ms)</label>
                      <input
                        type="number"
                        value={msg.duration || 3000}
                        onChange={(e) => updateMessage(msg.id, { duration: Number(e.target.value) })}
                        className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-300 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add message buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleAddMessage('user')}
              className="flex-1 py-2.5 px-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm font-medium rounded-lg border border-blue-600/30 transition-colors"
            >
              + User Message
            </button>
            <button
              onClick={() => handleAddMessage('assistant')}
              className="flex-1 py-2.5 px-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-sm font-medium rounded-lg border border-green-600/30 transition-colors"
            >
              + Assistant Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
