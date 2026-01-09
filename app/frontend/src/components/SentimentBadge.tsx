import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Meh, MessageSquare } from 'lucide-react';

interface SentimentBadgeProps {
  sentiment: string;
}

export function SentimentBadge({ sentiment }: SentimentBadgeProps) {
  const sentimentConfig = {
    positive: {
      icon: Smile,
      label: 'Positive',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    negative: {
      icon: Frown,
      label: 'Negative',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
    neutral: {
      icon: Meh,
      label: 'Neutral',
      className: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    sarcasm: {
      icon: MessageSquare,
      label: 'Sarcasm',
      className: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  };

  const config = sentimentConfig[sentiment as keyof typeof sentimentConfig] || sentimentConfig.neutral;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}