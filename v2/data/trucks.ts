export type TruckStatus = 'WAITING' | 'LOADING' | 'IN_TRANSIT' | 'DELAYED';

export interface Truck {
  id: string;
  supplier: string;
  type: 'DRY' | 'COLD';
  etaMinutes: number;
  warehouseId: string;
  status: TruckStatus;
}

export const trucks: Truck[] = [
  {
    id: 'TR-1001',
    supplier: 'Supplier A',
    type: 'DRY',
    etaMinutes: 25,
    warehouseId: 'WH-TEH-N',
    status: 'WAITING'
  },
  {
    id: 'TR-2004',
    supplier: 'Supplier B',
    type: 'COLD',
    etaMinutes: 10,
    warehouseId: 'WH-TEH-C',
    status: 'IN_TRANSIT'
  }
];
