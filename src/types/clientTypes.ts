
export type ClientStatus = 'connected' | 'warning' | 'error' | 'inactive';

export interface Client {
  id: string;
  name: string;
  status: ClientStatus;
  lastSeen: Date;
  groupId?: string;
  selected?: boolean;
}

export interface Group {
  id: string;
  name: string;
  clients: Client[];
  selected?: boolean;
}
