export interface StoredTicket {
  ticketNumber: string;
  barcode: string;
  securityHash: string;
  terminalCode: string;
  agencyName: string;
  agencyCity: string;
  betType: string;
  stake: number;
  totalOdds: number;
  potentialPayout: number;
  currency: string;
  status: 'PENDING' | 'WON' | 'LOST' | 'PAID' | 'CANCELLED';
  createdAt: string;
  expiresAt: string;
  selections: any[];
  termsNotice: string;
}

// In-memory global store across Next.js API routes
const globalTickets = new Map<string, StoredTicket>();

export function saveTicket(ticket: StoredTicket): StoredTicket {
  globalTickets.set(ticket.ticketNumber.toUpperCase(), ticket);
  globalTickets.set(ticket.barcode.toUpperCase(), ticket);
  return ticket;
}

export function findTicket(code: string): StoredTicket | undefined {
  const clean = code.trim().toUpperCase();
  return globalTickets.get(clean);
}

export function markTicketPaid(code: string): StoredTicket | undefined {
  const ticket = findTicket(code);
  if (ticket) {
    ticket.status = 'PAID';
    globalTickets.set(ticket.ticketNumber.toUpperCase(), ticket);
    globalTickets.set(ticket.barcode.toUpperCase(), ticket);
  }
  return ticket;
}
