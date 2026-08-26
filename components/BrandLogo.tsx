import Image from "next/image";

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Image
      className={compact ? "brandLogo compact" : "brandLogo"}
      src="/smarterx-logo.png"
      alt="SmarteRX"
      width={2200}
      height={704}
      priority
    />
  );
}
