"use client";

import { useMemo, useState } from "react";
import type { MemberMessage } from "@/lib/mock-data/messages";

export default function MessageCenter({ initialMessages }: { initialMessages: MemberMessage[] }) {
  const [selectedId, setSelectedId] = useState(initialMessages[0]?.id ?? "");
  const [readIds, setReadIds] = useState(() => new Set(initialMessages.filter((m) => !m.unread).map((m) => m.id)));
  const [filter, setFilter] = useState<"All" | MemberMessage["category"]>("All");

  const filtered = useMemo(
    () => initialMessages.filter((message) => filter === "All" || message.category === filter),
    [filter, initialMessages]
  );

  const selected = initialMessages.find((message) => message.id === selectedId) ?? filtered[0];
  const unreadCount = initialMessages.filter((message) => !readIds.has(message.id)).length;

  function openMessage(id: string) {
    setSelectedId(id);
    setReadIds((current) => new Set(current).add(id));
  }

  return (
    <div className="messageCenter">
      <aside className="messageInbox panelCard">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">Inbox</span>
            <h2>Messages</h2>
          </div>
          <span className="statusChip">{unreadCount} unread</span>
        </div>

        <div className="messageFilters">
          {(["All", "Order", "Benefit", "Pharmacy", "Support"] as const).map((item) => (
            <button
              key={item}
              className={filter === item ? "messageFilter active" : "messageFilter"}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="messageList">
          {filtered.map((message) => {
            const unread = !readIds.has(message.id);
            return (
              <button
                key={message.id}
                className={selected?.id === message.id ? "messageListItem selected" : "messageListItem"}
                onClick={() => openMessage(message.id)}
              >
                <div className="messageListTop">
                  <strong>{message.subject}</strong>
                  {unread && <span className="messageUnreadDot" aria-label="Unread" />}
                </div>
                <span>{message.sender}</span>
                <p>{message.preview}</p>
                <small>{message.date} · {message.category}</small>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="messageDetail panelCard">
        {selected ? (
          <>
            <span className="eyebrow">{selected.category}</span>
            <h2>{selected.subject}</h2>
            <div className="messageMeta">
              <span>From</span><strong>{selected.sender}</strong>
              <span>Date</span><strong>{selected.date}</strong>
            </div>
            <p className="messageBody">{selected.body}</p>
            <div className="workflowNotice">Prototype secure messaging only. No PHI or live support message was transmitted.</div>
          </>
        ) : (
          <div className="memberEmptyState"><h2>Select a message</h2><p>Choose a message from the inbox to view it.</p></div>
        )}
      </section>
    </div>
  );
}
