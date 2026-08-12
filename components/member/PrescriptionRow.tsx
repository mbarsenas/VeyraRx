import Link from "next/link";
import type { Prescription } from "@/lib/mock-data/member";

export default function PrescriptionRow({ prescription }: { prescription: Prescription }) {
  const statusClass =
    prescription.status === "Refill available"
      ? "statusChip attention"
      : prescription.status === "Processing"
      ? "statusChip processing"
      : "statusChip";

  return (
    <div className="prescriptionRow">
      <div className="rxBadge">Rx</div>

      <div className="rxDetails">
        <strong>{prescription.name} {prescription.strength}</strong>
        <span>{prescription.supply}</span>
      </div>

      <div className="rxStatus">
        <span className={statusClass}>{prescription.status}</span>
      </div>

      <Link className="textButton" href={prescription.primaryActionHref}>
        {prescription.primaryActionLabel} -&gt;
      </Link>
    </div>
  );
}
