export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Incident {
  id: string;
  title: string;
  area: 'INBOUND' | 'DISTRIBUTION' | 'LAST_MILE';
  severity: IncidentSeverity;
  impact: string;
  recommendation: string;
}

export const incidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'تراکم صف تخلیه انبار تهران شمال',
    area: 'INBOUND',
    severity: 'HIGH',
    impact: 'افزایش زمان انتظار کامیون‌ها',
    recommendation: 'انتقال Slot تخلیه و توزیع ورود خودروها'
  }
];
