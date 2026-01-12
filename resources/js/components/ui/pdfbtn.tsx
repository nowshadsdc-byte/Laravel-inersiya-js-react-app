import { Button } from "./button";

interface PdfButtonProps {
  href: string;
  label?: string;
}

export function PdfButton({ href, label = "Download PDF" }: PdfButtonProps) {
  return (
    <Button asChild>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    </Button>
  );
}
