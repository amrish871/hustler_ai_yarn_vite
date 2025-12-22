import { Message } from '../screens/Home/Home.types';

type Props = {
  messages: Message[];
  onSend: (text: string) => void;
  onBack: () => void;
};

export function ChatPanel({ messages, onSend, onBack }: Props) {
  return (
    <div className="bg-white/10 rounded-2xl p-4">
      <button onClick={onBack} className="text-white mb-2">
        ← Back
      </button>

      <div className="h-48 overflow-y-auto space-y-2 mb-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-xl max-w-xs ${
              m.sender === 'user'
                ? 'bg-blue-500 ml-auto'
                : 'bg-white/20'
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <input
        placeholder="Type message"
        onKeyDown={e =>
          e.key === 'Enter' &&
          onSend((e.target as HTMLInputElement).value)
        }
        className="w-full bg-white/10 p-2 rounded-full text-white"
      />
    </div>
  );
}
