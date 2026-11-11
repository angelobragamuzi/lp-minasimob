import { whatsappUrl } from '../lib/whatsapp';
import { WhatsAppIcon } from './Icons';

interface Props {
  message: string;
  label?: string;
  variant?: 'primary' | 'compact' | 'outline';
  className?: string;
  /** Rótulo acessível quando o texto visível é curto */
  ariaLabel?: string;
}

export function WhatsAppButton({ message, label = 'Consultar pelo WhatsApp', variant = 'primary', className, ariaLabel }: Props) {
  return (
    <a
      className={`btn btn-wa btn-${variant} ${className ?? ''}`}
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel ? `${ariaLabel} (abre o WhatsApp)` : undefined}
    >
      <WhatsAppIcon size={variant === 'compact' ? 18 : 20} />
      <span>{label}</span>
    </a>
  );
}
