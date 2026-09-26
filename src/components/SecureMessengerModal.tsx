import React, { useState } from 'react';
import { SecureThread, MessageItem } from '../types';
import { 
  X, 
  MessageSquare, 
  ShieldCheck, 
  Send, 
  Lock, 
  Paperclip, 
  CheckCircle2, 
  User, 
  Building2,
  FileCheck
} from 'lucide-react';

interface SecureMessengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  threads: SecureThread[];
  activeThreadId?: string;
  userRole: 'tenant' | 'landlord';
  onSendMessage: (threadId: string, message: MessageItem) => void;
}

export const SecureMessengerModal: React.FC<SecureMessengerModalProps> = ({
  isOpen,
  onClose,
  threads,
  activeThreadId,
  userRole,
  onSendMessage
}) => {
  const [selectedThreadId, setSelectedThreadId] = useState<string>(
    activeThreadId || threads[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const [simulatedAttachment, setSimulatedAttachment] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentThread = threads.find(t => t.id === selectedThreadId) || threads[0];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !currentThread) return;

    const newMessage: MessageItem = {
      id: `msg_${Date.now()}`,
      senderId: userRole === 'tenant' ? 'tenant_current' : 'landlord_1',
      senderName: userRole === 'tenant' ? 'Jordan Taylor' : currentThread.landlordName,
      senderRole: userRole,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      attachmentName: simulatedAttachment || undefined,
      isEncrypted: true
    };

    onSendMessage(currentThread.id, newMessage);
    setInputText('');
    setSimulatedAttachment(null);

    // If tenant sent message, simulate prompt landlord reply after 1.5s
    if (userRole === 'tenant') {
      setTimeout(() => {
        const replyText = text.toLowerCase().includes('tour')
          ? `Thank you for asking! I have availability this weekend. You can also pick a walkthrough slot right in your application status tracker.`
          : text.toLowerCase().includes('voucher')
            ? `Yes! We gladly welcome Housing Choice and Section 8 vouchers. All required documentation is processed quickly.`
            : `Hello Jordan! Thank you for your inquiry. Everything regarding ${currentThread.propertyTitle} is up to date and we are reviewing applications now.`;

        const autoReply: MessageItem = {
          id: `msg_reply_${Date.now()}`,
          senderId: currentThread.landlordId,
          senderName: currentThread.landlordName,
          senderRole: 'landlord',
          text: replyText,
          timestamp: new Date().toISOString(),
          isEncrypted: true
        };
        onSendMessage(currentThread.id, autoReply);
      }, 1500);
    }
  };

  const handleAttachDocument = () => {
    setSimulatedAttachment('Travis_County_Voucher_Authorization.pdf');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-4xl w-full h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">Secure Housing Communication</h2>
                <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <Lock className="w-3 h-3 text-blue-600" />
                  <span>256-bit Encrypted</span>
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Direct verified messaging between tenants and housing providers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Messenger Body: Thread sidebar on left, Chat window on right */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Thread List Sidebar */}
          <div className="w-1/3 min-w-[220px] max-w-[280px] border-r border-neutral-200 bg-neutral-50/70 overflow-y-auto flex flex-col divide-y divide-neutral-100">
            <div className="p-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Conversations ({threads.length})
            </div>

            {threads.map(t => {
              const isSelected = currentThread?.id === t.id;
              const otherParty = userRole === 'tenant' ? t.landlordName : t.tenantName;
              const lastMsg = t.messages[t.messages.length - 1];

              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedThreadId(t.id)}
                  className={`p-3 text-left w-full transition-colors flex flex-col gap-1 ${
                    isSelected ? 'bg-white border-l-4 border-l-blue-700 shadow-2xs' : 'hover:bg-neutral-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 truncate">
                      {otherParty}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-blue-700 truncate">
                    {t.propertyTitle}
                  </span>
                  <p className="text-[11px] text-neutral-500 line-clamp-1">
                    {lastMsg ? lastMsg.text : 'Start conversation...'}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Chat Conversation Area */}
          {currentThread ? (
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              
              {/* Chat Sub-header */}
              <div className="p-3.5 border-b border-neutral-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    {(userRole === 'tenant' ? currentThread.landlordName : currentThread.tenantName).charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-neutral-900">
                        {userRole === 'tenant' ? currentThread.landlordName : currentThread.tenantName}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-[11px] text-neutral-500">
                      Property: {currentThread.propertyTitle}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-400 font-mono">
                  {currentThread.propertyAddress}
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Security Advisory */}
                <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-center text-[11px] text-blue-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700 inline-block mr-1" />
                  Your communication is secured by Hunt & Hold encrypted tunnel. Never wire money outside the verified app platform.
                </div>

                {currentThread.messages.map(msg => {
                  const isMe = (userRole === 'tenant' && msg.senderRole === 'tenant') || 
                               (userRole === 'landlord' && msg.senderRole === 'landlord');

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-[10px] font-semibold text-neutral-500">
                          {msg.senderName}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                          isMe 
                            ? 'bg-blue-700 text-white rounded-br-xs' 
                            : 'bg-neutral-100 text-neutral-900 rounded-bl-xs border border-neutral-200'
                        }`}
                      >
                        {msg.text}

                        {msg.attachmentName && (
                          <div className={`mt-2 pt-2 border-t flex items-center gap-1.5 text-[11px] font-mono ${
                            isMe ? 'border-blue-600 text-blue-100' : 'border-neutral-200 text-blue-700'
                          }`}>
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>{msg.attachmentName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Inquiry Suggestions */}
              <div className="px-4 py-2 border-t border-neutral-100 bg-neutral-50/50 flex gap-1.5 overflow-x-auto">
                <span className="text-[11px] font-semibold text-neutral-400 shrink-0 self-center">Quick Inquiries:</span>
                {[
                  "Is this unit still vacant?",
                  "Are all utilities included in rent?",
                  "Can we schedule an in-person walkthrough?",
                  "Do you accept Section 8 vouchers?"
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(preset)}
                    className="text-[11px] bg-white border border-neutral-200 text-neutral-700 hover:text-blue-700 hover:border-blue-300 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-neutral-200 bg-white">
                {simulatedAttachment && (
                  <div className="mb-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                      <span>Attached: <strong>{simulatedAttachment}</strong></span>
                    </div>
                    <button 
                      onClick={() => setSimulatedAttachment(null)}
                      className="text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAttachDocument}
                    title="Attach Voucher or Proof of Income Document"
                    className="p-2 text-neutral-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-neutral-200"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a secure message to landlord..."
                    className="flex-1 px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!inputText.trim()}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-neutral-400 text-xs">
              Select a conversation to start chatting securely.
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
