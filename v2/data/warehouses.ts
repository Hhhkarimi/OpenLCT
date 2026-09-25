export type Warehouse = {
  id: string;
  name: string;
  type: 'DRY' | 'COLD';
  docks: number;
  capacity: number;
  currentQueue: number;
  utilization: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
};

export const warehouses: Warehouse[] = [
  {
    id: 'WH-001',
    name: 'تهران شمال',
    type: 'DRY',
    docks: 24,
    capacity: 12000,
    currentQueue: 18,
    utilization: 0.84,
    status: 'WARNING'
  },
  {
    id: 'WH-002',
    name: 'مرکز سرد تهران',
    type: 'COLD',
    docks: 12,
    capacity: 6000,
    currentQueue: 6,
    utilization: 0.62,
    status: 'NORMAL'
  }
];
