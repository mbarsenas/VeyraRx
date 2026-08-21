import MemberTopbar from "@/components/member/MemberTopbar";
import MessageCenter from "@/components/member/MessageCenter";
import { messages } from "@/lib/mock-data/messages";

export default function MessagesPage() {
  return (
    <>
      <MemberTopbar
        eyebrow="Messages"
        title="Secure messages"
        description="Review pharmacy-benefit notifications, order updates and member support messages."
      />
      <MessageCenter initialMessages={messages} />
    </>
  );
}
