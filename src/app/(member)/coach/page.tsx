"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Send, Sparkles, Scale, Utensils, CheckCircle2, User } from "lucide-react";

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  action?: {
    type: string;
    details: any;
  } | null;
}

export default function CoachPage() {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "initial",
      role: "assistant",
      content:
        "Hai! Aku AI Coach HDM kau. Beritahu aku apa yang kau makan tadi, atau berapa berat badan pagi ni — aku boleh tolong fahamkan dan rekodkan terus ke dalam sistem.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  async function handleSend(textToSend?: string) {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: MessageItem = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationId,
        }),
      });

      const json = await res.json();

      if (json.success && json.data) {
        setConversationId(json.data.conversationId);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: json.data.response,
            action: json.data.action,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              json.error?.message ||
              "Maaf, berlaku sedikit gangguan semasa memproses. Cuba semula sebentar lagi.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Tidak dapat berhubung dengan pelayan AI. Sila semak sambungan anda.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col justify-between">
      {/* Messages Scroll Area */}
      <div className="flex flex-col gap-3.5 overflow-y-auto pr-1 pb-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                m.role === "user"
                  ? "bg-secondary text-foreground border-border"
                  : "bg-primary/20 text-primary border-primary/30"
              }`}
            >
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            {/* Bubble */}
            <div className="flex flex-col gap-1.5 max-w-[85%]">
              <Card
                className={`p-3.5 border ${
                  m.role === "user"
                    ? "rounded-tr-none bg-primary text-primary-foreground border-primary"
                    : "rounded-tl-none bg-card border-border/80 text-foreground"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
                    <Sparkles className="h-3 w-3" />
                    <span>AI Coach HDM</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-line">{m.content}</p>
              </Card>

              {/* Action executed indicator tag */}
              {m.action && (
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-secondary/80 px-2.5 py-1 text-[11px] font-medium border border-border/80 text-muted-foreground self-start">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  {m.action.type === "log_weight" ? (
                    <span className="flex items-center gap-1">
                      <Scale className="h-3 w-3 text-warning" />
                      Data Berat Disimpan
                    </span>
                  ) : m.action.type === "log_food" ? (
                    <span className="flex items-center gap-1">
                      <Utensils className="h-3 w-3 text-primary" />
                      Data Makanan Disimpan
                    </span>
                  ) : (
                    <span>Tindakan Sistem Dilaksanakan</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/30">
              <Bot className="h-4 w-4" />
            </div>
            <Card className="rounded-tl-none bg-card p-3 border border-border/80">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-xs">Coach sedang berfikir...</span>
              </div>
            </Card>
          </div>
        )}

        {/* Quick Suggestion Chips (when only initial message is visible) */}
        {messages.length === 1 && (
          <div className="mt-2 flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">Cuba taip / tekan cadangan:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSend("Pagi tadi makan 3 telur rebus dan 2 keping roti")}
                className="rounded-xl border border-border bg-secondary/50 px-3 py-1.5 text-xs text-foreground/90 hover:bg-secondary transition-colors text-left"
              >
                &quot;Pagi tadi makan 3 telur rebus dan 2 keping roti&quot;
              </button>
              <button
                onClick={() => handleSend("Berat pagi ni 78.4kg")}
                className="rounded-xl border border-border bg-secondary/50 px-3 py-1.5 text-xs text-foreground/90 hover:bg-secondary transition-colors text-left"
              >
                &quot;Berat pagi ni 78.4kg&quot;
              </button>
              <button
                onClick={() => handleSend("Berapa baki kalori dan progres aku hari ni?")}
                className="rounded-xl border border-border bg-secondary/50 px-3 py-1.5 text-xs text-foreground/90 hover:bg-secondary transition-colors text-left"
              >
                &quot;Berapa baki kalori dan progres aku hari ni?&quot;
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-2 flex items-center gap-2 rounded-2xl bg-secondary/80 p-1.5 border border-border"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesej Coach... (cth: 'Makan ayam 200g')"
          className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          disabled={loading}
        />
        <Button
          type="submit"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-xl"
          disabled={!input.trim() || loading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
