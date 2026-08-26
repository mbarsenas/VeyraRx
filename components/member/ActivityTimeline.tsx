import type { ActivityItem } from "@/lib/domain/member";

export default function ActivityTimeline({ activity }: { activity: ActivityItem[] }) {
  return (
    <article className="panelCard">
      <div className="panelHeader">
        <div><span className="eyebrow">Recent activity</span><h2>Orders & updates</h2></div>
      </div>
      <div className="timeline">
        {activity.map((item) => (
          <div className="timelineItem" key={`${item.title}-${item.time}`}>
            <span className="timelineDot" />
            <div><strong>{item.title}</strong><small>{item.time}</small></div>
          </div>
        ))}
        {activity.length === 0 ? <p className="railText">No recent account activity.</p> : null}
      </div>
    </article>
  );
}
