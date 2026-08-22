"use client";

import { useMemo, useState, useTransition } from "react";
import type { MemberMessage } from "@/lib/domain/message";
import { markMessageRead } from "@/app/dashboard/messages/actions";
import styles from "./MessageCenter.module.css";

export default function MessageCenter({ initialMessages }: { initialMessages: MemberMessage[] }) {
  const [selectedId, setSelectedId] = useState(initialMessages[0]?.id ?? "");
  const [readIds, setReadIds] = useState(() => new Set(initialMessages.filter((m) => !m.unread).map((m) => m.id)));
  const [filter, setFilter] = useState<"All" | MemberMessage["category"]>("All");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(
    () => initialMessages.filter((message) => filter === "All" || message.category === filter),
    [filter, initialMessages]
  );

  const selected = initialMessages.find((message) => message.id === selectedId) ?? filtered[0];
  const unreadCount = initialMessages.filter((message) => !readIds.has(message.id)).length;

  function openMessage(id: string) {
    setSelectedId(id);

    if (readIds.has(id)) return;

    setReadIds((current) => new Set(current).add(id));
    startTransition(async () => {
      const result = await markMessageRead(id);
      if (!result.ok) {
        setReadIds((current) => {
          const next = new Set(current);
          next.delete(id);
          return next;
        });
      }
    });
  }

  return (
    <div className={styles.messageCenter}>
      <aside className={`${styles.messageInbox} panelCard`}>
        <div className="panelHeader">
          <div>
            <span className="eyebrow">Inbox</span>
            <h2>Messages</h2>
          </div>
          <span className="statusChip">{unreadCount} unread</span>
        </div>

        <div className={styles.messageFilters}>
          {(["All", "Order", "Benefit", "Pharmacy", "Support"] as const).map((item) => (
            <button
              key={item}
              className={`${styles.messageFilter} ${filter === item ? styles.active : ""}`}
              onClick={() => setFilter(item)}
              disabled={isPending}
            >
              {item}
            </button>
          ))}
        </div>

        <div className={styles.messageList}>
          {filtered.map((message) => {
            const unread = !readIds.has(message.id);
            return (
              <button
                key={message.id}
                className={`${styles.messageListItem} ${selected?.id === message.id ? styles.selected : ""}`}
                onClick={() => openMessage(message.id)}
              >
                <div className={styles.messageListTop}>
                  <strong>{message.subject}</strong>
                  {unread && <span className={styles.messageUnreadDot} aria-label="Unread" />}
                </div>
                <span>{message.sender}</span>
                <p>{message.preview}</p>
                <small>{message.date} - {message.category}</small>
              </button>
            );
          })}
        </div>
      </aside>

      <section className={`${styles.messageDetail} panelCard`}>
        {selected ? (
          <>
            <span className="eyebrow">{selected.category}</span>
            <h2>{selected.subject}</h2>
            <div className={styles.messageMeta}>
              <span>From</span><strong>{selected.sender}</strong>
              <span>Date</span><strong>{selected.date}</strong>
            </div>
            <p className={styles.messageBody}>{selected.body}</p>
            <div className="workflowNotice">Messages are stored in your linked SmarteRX member record.</div>
          </>
        ) : (
          <div className={styles.empty}><h2>Select a message</h2><p>Choose a message from the inbox to view it.</p></div>
        )}
      </section>
    </div>
  );
}
