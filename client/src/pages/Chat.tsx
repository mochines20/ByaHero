import { FormEvent, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../lib/api';
import { useToastStore } from '../store/uiStore';

export function ChatPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const pushToast = useToastStore((s) => s.pushToast);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const { data } = await api.post('/chat', { message });
      setResponse(data.response);
    } catch (err: any) {
      pushToast(err.message || 'Chat failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">ByaHero AI Chat</h1>
      <form onSubmit={submit} className="mb-4">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about your commute..."
          className="mb-2"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </Button>
      </form>
      {response && (
        <div className="p-4 bg-gray-100 rounded">
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
