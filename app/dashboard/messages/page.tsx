import MemberTopbar from "@/components/member/MemberTopbar";
import MessageCenter from "@/components/member/MessageCenter";
import { getAuthenticatedMemberMessages } from "@/lib/data/member-messages";

export default async function MessagesPage() {
  const messages = await getAuthenticatedMemberMessages();

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
