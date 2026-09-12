"use client";

import { useState, useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getTripMessages, sendTripMessage, type TripMessage } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import type { User } from "firebase/auth";

interface TripChatSectionProps {
  tripId: string;
}

export function TripChatSection({ tripId }: TripChatSectionProps) {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<TripMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const currentUser = await getCurrentUser();
        if (mounted) {
          setUser(currentUser);
        }
        
        const data = await getTripMessages(tripId);
        if (mounted) {
          setMessages(data);
          scrollToBottom();
        }
      } catch (err: unknown) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load messages.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, [tripId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    setError(null);
    try {
      const message = await sendTripMessage(tripId, newMessage);
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
      scrollToBottom();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="flex h-[600px] flex-col border-line bg-paper">
      {/* Header */}
      <div className="border-b border-line px-5 py-4">
        <h2 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
          <Icon name="message" size={20} className="text-pine" />
          Group Chat
        </h2>
        <p className="text-sm text-muted">Plan together with your trip members</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-pine/30 border-t-pine" />
          </div>
        ) : error && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-coral text-sm">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
              <Icon name="message" size={24} />
            </div>
            <p className="text-sm">No messages yet.</p>
            <p className="text-xs">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === user?.uid;
            const showDate = idx === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[idx - 1].createdAt).toDateString();
            
            return (
              <div key={msg.id || idx}>
                {showDate && (
                  <div className="my-6 text-center">
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-muted">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                )}
                <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"} mb-4`}>
                  <div className={`flex max-w-[80%] flex-col ${isMe ? "items-end" : "items-start"}`}>
                    {!isMe && (
                      <span className="mb-1 pl-1 text-[11px] font-medium text-muted">
                        {msg.senderName}
                      </span>
                    )}
                    <div
                      className={`relative rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                        isMe
                          ? "bg-pine text-white rounded-br-sm"
                          : "bg-white border border-line text-ink rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className={`mt-1 text-[10px] text-muted/70 ${isMe ? "pr-1" : "pl-1"}`}>
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Toast */}
      {error && messages.length > 0 && (
        <div className="px-5 pb-2">
          <div className="rounded-md bg-coral-soft p-2 text-xs text-coral text-center">
            {error}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-line bg-stone-50/50 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full rounded-full border border-line bg-white px-5 py-3 text-sm text-ink placeholder:text-muted focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine transition shadow-sm"
            disabled={isSending || isLoading}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending || isLoading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pine text-white transition hover:bg-pine-dark disabled:bg-stone-300 disabled:text-stone-100 shadow-sm"
          >
            {isSending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Icon name="navigation" size={18} className="ml-1 mt-0.5 rotate-90" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}
