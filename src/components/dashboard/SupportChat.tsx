'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

type Conversation = {
  id: string;
  status: 'open' | 'resolved';
  created_at: string;
  lastMessage?: string;
  unread?: number;
};

type Message = {
  id: string;
  sender_type: 'user' | 'admin';
  message: string;
  status: 'unread' | 'read';
  created_at: string;
};

export function SupportChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) ?? conversations[0],
    [activeConversationId, conversations]
  );

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/support/conversations');
      const data = await res.json();
      const convos = data.conversations || [];
      setConversations(convos);
      if (!activeConversationId && convos.length > 0) {
        setActiveConversationId(convos[0].id);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId]);

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
        const data = await res.json();
        setMessages(data.messages || []);
        // After reading messages, refresh conversation list to update unread badge
        fetchConversations();
      } catch (err) {
        console.error('Failed to load messages', err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchConversations]
  );

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(() => {
      fetchConversations();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchConversations]);

  useEffect(() => {
    if (!activeConversationId) return;

    fetchMessages(activeConversationId);
    const messageInterval = setInterval(() => {
      fetchMessages(activeConversationId);
    }, 4000);

    return () => clearInterval(messageInterval);
  }, [activeConversationId, fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    if (!messageInput.trim()) return;

    setIsLoading(true);
    try {
      const payload: Record<string, unknown> = {
        sender: 'user',
        message: messageInput,
      };

      if (activeConversation?.id) {
        payload.conversationId = activeConversation.id;
      }

      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.conversationId) {
        await fetchConversations();
        setActiveConversationId(data.conversationId);
      }

      setMessageInput('');
      if (activeConversation?.id || data.conversationId) {
        await fetchMessages(data.conversationId ?? activeConversation.id);
      }
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleStartNewConversation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/support/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello, I need help.' }),
      });
      const data = await res.json();
      if (data.conversationId) {
        await fetchConversations();
        setActiveConversationId(data.conversationId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Support</CardTitle>
          <p className="text-sm text-muted-foreground">Talk with the CheckBeforeCommit team.</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Button size="sm" variant="secondary" onClick={handleStartNewConversation} disabled={isLoading}>
              Start a new conversation
            </Button>
            <div className="space-y-2">
              {conversations.length === 0 && (
                <div className="text-sm text-muted-foreground">No conversations yet. Start a new chat.</div>
              )}
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setActiveConversationId(conversation.id)}
                  className={`w-full text-left rounded-lg p-3 border ${
                    conversation.id === activeConversationId
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-border/20 bg-secondary/5 hover:bg-secondary/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Conversation</span>
                    {conversation.unread ? (
                      <Badge className="ml-2">{conversation.unread}</Badge>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage ?? 'No messages yet'}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(conversation.created_at).toLocaleString()}</p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="col-span-2 grid gap-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
            <p className="text-sm text-muted-foreground">Send a message and our team will reply as soon as possible.</p>
          </CardHeader>
          <CardContent className="flex flex-col h-[500px]">
            <div className="flex-1 overflow-hidden rounded-xl border border-border/20">
              <ScrollArea ref={scrollRef} className="h-full">
                <div className="p-4 space-y-3">
                  {messages.length === 0 && (
                    <p className="text-sm text-muted-foreground">No messages yet. Start the conversation by sending a message.</p>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-xl max-w-[70%] ${
                        message.sender_type === 'user'
                          ? 'bg-primary/10 self-end'
                          : 'bg-secondary/10 self-start'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(message.created_at).toLocaleString()} • {message.sender_type}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={sendMessage} disabled={!messageInput.trim() || isLoading}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
