import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// For streaming Edge Function calls we need the full URL and anon key
const SUPABASE_URL = "https://zinyvsplazwfgmwcvrpa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppbnl2c3BsYXp3Zmdtd2N2cnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1OTUzMzIsImV4cCI6MjA3MDE3MTMzMn0.d5pDvhwZJkjIwpmq1JA8KGgzShwDuWC4ptfSeT2axmU";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const RobotAvatar = ({ thinking, speaking }: { thinking: boolean; speaking: boolean }) => {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`relative size-12 rounded-full bg-gradient-brand shadow-brand-glow flex items-center justify-center border border-foreground/10 ${
        thinking ? "animate-pulse" : ""
      }`}
      aria-hidden
    >
      {/* Eyes */}
      <div className="absolute inset-0 flex items-center justify-center gap-3">
        <span
          className={`block w-1.5 rounded-full bg-foreground ${blink ? "h-0.5" : "h-1.5"}`}
        />
        <span
          className={`block w-1.5 rounded-full bg-foreground ${blink ? "h-0.5" : "h-1.5"}`}
        />
      </div>
      {/* Mouth */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-foreground transition-all ${
          speaking ? "w-4" : thinking ? "w-3" : "w-2"
        }`}
      />
    </div>
  );
};

const AssistantWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I’m your Limejuic assistant. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const placeholder = useMemo(
    () => "Ask about our services, timelines, pricing approach, or tech stack…",
    []
  );

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    const updateAssistant = (chunk: string) => {
      setMessages((prev) => {
        const copy = [...prev];
        // Append to the last message (assistant placeholder)
        const lastIndex = copy.length - 1;
        copy[lastIndex] = {
          role: "assistant",
          content: copy[lastIndex].content + chunk,
        };
        return copy;
      });
    };

    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/ai-assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!resp.ok) {
        const err = await resp.text().catch(() => "");
        try {
          const j = JSON.parse(err);
          if (resp.status === 429) {
            toast.error(j?.error || "Too many requests. Please try again later.");
          } else {
            toast.error(j?.error || "Something went wrong");
          }
        } catch {
          toast.error("Something went wrong");
        }
        return;
      }

      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      setSpeaking(true);
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          // SSE: split by lines and parse data: <token>
          const lines = chunk.split(/\r?\n/);
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const json = JSON.parse(data);
              const token = json.token ?? json.content ?? json.delta ?? json; // support simple cases
              if (typeof token === "string") updateAssistant(token);
              else if (typeof token?.content === "string") updateAssistant(token.content);
            } catch {
              // If server already sends plain tokens, just append
              updateAssistant(data);
            }
          }
        }
      }
      setTimeout(() => setSpeaking(false), 800);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle button */}
      <button
        className="relative flex items-center gap-3 rounded-full border border-foreground/10 bg-card px-3 py-2 shadow-brand-glow focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        onClick={() => setOpen((o) => !o)}
      >
        <RobotAvatar thinking={loading} speaking={speaking} />
        <span className="text-sm hidden sm:block">
          {open ? "Close" : "Ask Limejuic AI"}
        </span>
      </button>

      {/* Panel */}
      {open && (
        <Card className="mt-3 w-[92vw] max-w-sm border-foreground/10 overflow-hidden">
          <div className="flex items-center gap-3 p-3 border-b">
            <RobotAvatar thinking={loading} speaking={speaking} />
            <div>
              <p className="text-sm font-medium">Limejuic Assistant</p>
              <p className="text-xs text-muted-foreground">Human-like, responsive help</p>
            </div>
          </div>
          <div ref={listRef} className="max-h-72 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm leading-relaxed ${
                  m.role === "assistant" ? "bg-secondary/50" : "bg-accent/50"
                } p-2 rounded-md border border-foreground/10`}
              >
                {m.content}
              </div>
            ))}
          </div>
          <div className="p-3 flex items-center gap-2 border-t">
            <label htmlFor="assistant-input" className="sr-only">
              Ask a question
            </label>
            <Input
              id="assistant-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              onKeyDown={onKeyDown}
              disabled={loading}
            />
            <Button onClick={send} disabled={loading} variant="brand">
              {loading ? "Thinking…" : "Send"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AssistantWidget;
