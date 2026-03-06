'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

type AdminConversation = {
  id: string;
  user_id: string;
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

export function SupportPanel() {
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) ?? conversations[0],
    [activeConversationId, conversations]
  );

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/support/admin/conversations');
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
        const res = await fetch(`/api/support/admin/conversations/${conversationId}/messages`);
        const data = await res.json();
        setMessages(data.messages || []);
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
    const interval = setInterval(() => {
      fetchMessages(activeConversationId);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeConversationId, fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendReply() {
    if (!reply.trim() || !activeConversation) return;
    setIsLoading(true);
    try {
      await fetch(`/api/support/admin/conversations/${activeConversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply }),
      });
      setReply('');
      await fetchMessages(activeConversation.id);
    } catch (err) {
      console.error('Failed to send reply', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function markResolved() {
    if (!activeConversation) return;
    setIsLoading(true);
    try {
      await fetch(`/api/support/admin/conversations/${activeConversation.id}/resolve`, {
        method: 'POST',
      });
      await fetchConversations();
    } catch (err) {
      console.error('Failed to mark resolved', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>User Conversations</CardTitle>
          <p className="text-sm text-muted-foreground">Select a conversation to view details.</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {conversations.length === 0 && (
            <p className="text-sm text-muted-foreground">No conversations yet.</p>
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
                <div>
                  <p className="text-sm font-semibold">{conversation.user_id}</p>
                  <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage ?? 'No messages yet'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {conversation.unread ? <Badge>{conversation.unread}</Badge> : null}
                  {conversation.status === 'resolved' ? (
                    <Badge variant="secondary">Resolved</Badge>
                  ) : null}
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="col-span-2 grid gap-6">
        <Card className="h-full">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Selected Chat</CardTitle>
              {activeConversation ? (
                <p className="text-sm text-muted-foreground">
                  Conversation started: {new Date(activeConversation.created_at).toLocaleString()}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Select a conversation to begin.</p>
              )}
            </div>
            {activeConversation ? (
              <Button size="sm" variant="outline" onClick={markResolved} disabled={isLoading || activeConversation.status === 'resolved'}>
                {activeConversation.status === 'resolved' ? 'Resolved' : 'Mark Resolved'}
              </Button>
            ) : null}
          </CardHeader>
          <CardContent className="flex flex-col h-[550px]">
            <div className="flex-1 overflow-hidden rounded-xl border border-border/20">
              <ScrollArea ref={scrollRef} className="h-full">
                <div className="p-4 space-y-3">
                  {messages.length === 0 && (
                    <p className="text-sm text-muted-foreground">No messages in this conversation.</p>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-xl max-w-[70%] ${
                        message.sender_type === 'admin'
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

            {activeConversation ? (
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Write a reply..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="flex-1"
                  disabled={isLoading || activeConversation.status === 'resolved'}
                />
                <Button
                  onClick={sendReply}
                  disabled={!reply.trim() || isLoading || activeConversation.status === 'resolved'}
                >
                  Reply
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
