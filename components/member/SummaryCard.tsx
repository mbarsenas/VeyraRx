type SummaryCardProps = {
  label: string;
  value: string | number;
  detail?: string;
  progressPercent?: number;
};

export default function SummaryCard({ label, value, detail, progressPercent }: SummaryCardProps) {
  return (
    <article className="summaryCard">
      <span className="summaryLabel">{label}</span>
      <strong>{value}</strong>
      {typeof progressPercent === "number" ? (
        <div className="progressTrack"><span style={{ width: `${progressPercent}%` }} /></div>
      ) : null}
      {detail ? <small>{detail}</small> : null}
    </article>
  );
}
