
export type ClientStatus = 'connected' | 'warning' | 'error' | 'inactive';

export interface Client {
  id: string;
  name: string;
  status: ClientStatus;
  lastSeen: string;
  groupId?: string;
  selected?: boolean;
  ip?: string;
  location?: string;
  contact?: string;
}

export interface Group {
  id: string;
  name: string;
  clients: Client[];
  selected?: boolean;
}
