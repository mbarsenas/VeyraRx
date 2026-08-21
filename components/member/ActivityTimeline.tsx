import { recentActivity } from "@/lib/mock-data/member";

export default function ActivityTimeline() {
  return (
    <article className="panelCard">
      <div className="panelHeader">
        <div><span className="eyebrow">Recent activity</span><h2>Orders & updates</h2></div>
      </div>
      <div className="timeline">
        {recentActivity.map((item) => (
          <div className="timelineItem" key={`${item.title}-${item.time}`}>
            <span className="timelineDot" />
            <div><strong>{item.title}</strong><small>{item.time}</small></div>
          </div>
        ))}
      </div>
    </article>
  );
}
