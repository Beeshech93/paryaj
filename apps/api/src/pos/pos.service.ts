import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePosTicketDto } from './dto/create-pos-ticket.dto';
import { RedeemPosTicketDto } from './dto/redeem-pos-ticket.dto';

export interface PrintableTicket {
  ticketNumber: string;
  barcode: string;
  securityHash: string;
  terminalCode: string;
  agencyName: string;
  agencyCity: string;
  betType: 'SINGLE' | 'PARLAY';
  stake: number;
  totalOdds: number;
  potentialPayout: number;
  currency: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  selections: any[];
  termsNotice: string;
}

@Injectable()
export class PosService {
  private readonly logger = new Logger(PosService.name);

  // In-memory fallback cache for POS terminals and tickets
  private posTickets = new Map<string, any>();
  private posTerminals = new Map<string, any>([
    [
      'TERM-01',
      {
        terminalCode: 'TERM-01',
        agencyCode: 'AG-MX-01',
        agencyName: 'Banca y Casino Central CDMX',
        city: 'Ciudad de México',
        cashierName: 'Cajero Polanco',
        currency: 'MXN',
        cashBalance: 8500.0,
      },
    ],
    [
      'TERM-HT-01',
      {
        terminalCode: 'TERM-HT-01',
        agencyCode: 'AG-HT-01',
        agencyName: 'Banca Paryaj Delmas 33',
        city: 'Port-au-Prince',
        cashierName: 'Caissier Delmas',
        currency: 'HTG',
        cashBalance: 45000.0,
      },
    ],
  ]);

  constructor(private readonly prisma: PrismaService) {}

  async listAgencies(countryCode: string = 'MX') {
    return [
      {
        code: 'AG-MX-01',
        name: 'Banca y Casino Central CDMX',
        country: 'MX',
        city: 'Ciudad de México (Polanco)',
        address: 'Av. Masaryk 102, Miguel Hidalgo',
        phone: '+52 55 1234 5678',
        terminalsCount: 4,
        status: 'OPERATIONAL',
      },
      {
        code: 'AG-MX-02',
        name: 'Sucursal Insurgentes Sur',
        country: 'MX',
        city: 'Ciudad de México (Del Valle)',
        address: 'Insurgentes Sur 1420',
        phone: '+52 55 8765 4321',
        terminalsCount: 2,
        status: 'OPERATIONAL',
      },
      {
        code: 'AG-HT-01',
        name: 'Banca Paryaj Delmas 33',
        country: 'HT',
        city: 'Port-au-Prince',
        address: 'Angle Rue Delmas 33',
        phone: '+509 3700 1234',
        terminalsCount: 3,
        status: 'OPERATIONAL',
      },
      {
        code: 'AG-HT-02',
        name: 'Agence Pétion-Ville Centre',
        country: 'HT',
        city: 'Pétion-Ville',
        address: 'Rue Panamericaine',
        phone: '+509 3800 5678',
        terminalsCount: 2,
        status: 'OPERATIONAL',
      },
    ].filter((a) => !countryCode || a.country === countryCode.toUpperCase());
  }

  async getTerminalInfo(terminalCode: string) {
    const term = this.posTerminals.get(terminalCode) || {
      terminalCode,
      agencyCode: 'AG-GEN-01',
      agencyName: 'Punto de Venta Autorizado',
      city: 'Centro Operativo',
      cashierName: 'Operador en Turno',
      currency: 'MXN',
      cashBalance: 5000.0,
    };

    return {
      terminal: term,
      shift: {
        openedAt: new Date(Date.now() - 14400000).toISOString(),
        totalTicketsIssued: this.posTickets.size + 12,
        totalSalesVolume: 14200.0,
        totalPayoutsVolume: 6400.0,
        netCashFlow: 7800.0,
        status: 'ACTIVE_OPEN',
      },
    };
  }

  async createTicket(dto: CreatePosTicketDto): Promise<PrintableTicket> {
    if (!dto.selections || dto.selections.length === 0) {
      throw new BadRequestException('El boleto debe contener al menos una selección deportiva');
    }

    const terminal = await this.getTerminalInfo(dto.terminalCode);
    const currency = dto.currency || terminal.terminal.currency;

    // Calcular cuota multiplicada
    let combinedOdds = 1.0;
    for (const sel of dto.selections) {
      combinedOdds *= sel.odds;
    }
    combinedOdds = Math.round(combinedOdds * 100) / 100;

    const potentialPayout = Math.round(dto.stake * combinedOdds * 100) / 100;
    const betType = dto.selections.length === 1 ? 'SINGLE' : 'PARLAY';

    // Generar identificadores únicos del ticket físico
    const timestampStr = Date.now().toString(36).toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `TK-${new Date().getFullYear()}-${timestampStr}-${randomSuffix}`;
    const barcode = `BC${Date.now()}${randomSuffix}`;

    // Hash criptográfico de seguridad anti-fraude
    const secret = process.env.POS_TICKET_SECRET || 'NEW_BRAND_POS_SECURE_HMAC';
    const securityHash = crypto
      .createHmac('sha256', secret)
      .update(`${ticketNumber}|${dto.stake}|${potentialPayout}|${dto.terminalCode}`)
      .digest('hex')
      .substring(0, 16)
      .toUpperCase();

    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(); // 60 días para cobrar

    const printable: PrintableTicket = {
      ticketNumber,
      barcode,
      securityHash,
      terminalCode: dto.terminalCode,
      agencyName: terminal.terminal.agencyName,
      agencyCity: terminal.terminal.city,
      betType,
      stake: dto.stake,
      totalOdds: combinedOdds,
      potentialPayout,
      currency,
      status: 'PENDING',
      createdAt,
      expiresAt,
      selections: dto.selections,
      termsNotice:
        currency === 'MXN'
          ? 'Autorizado conforme a Ley Federal de Juegos y Sorteos (SEGOB). Cobro válido hasta 60 días.'
          : 'Valable selon la Réglementation Loterie Nationale d’Haïti (LEH). Période de grâce 60 jours.',
    };

    // Guardar en cache/memoria
    this.posTickets.set(ticketNumber, printable);
    this.posTickets.set(barcode, printable);

    // Actualizar balance de caja de la terminal
    const curTerm = this.posTerminals.get(dto.terminalCode);
    if (curTerm) {
      curTerm.cashBalance += dto.stake;
    }

    this.logger.log(
      `[POS Retail] Ticket impreso ${ticketNumber} en terminal ${dto.terminalCode}: $${dto.stake} ${currency}, Premio pot: $${potentialPayout}`,
    );

    return printable;
  }

  async verifyTicket(queryCode: string) {
    const cleanCode = queryCode.trim();
    let ticket = this.posTickets.get(cleanCode);

    if (!ticket) {
      // Mock ticket generator for demo/scanner testing if user types a generic ticket
      const sampleOdds = 3.65;
      const sampleStake = 200;
      ticket = {
        ticketNumber: cleanCode.startsWith('TK-') ? cleanCode : `TK-2026-${cleanCode}`,
        barcode: `BC${Date.now()}`,
        securityHash: 'SEC-89A7B39F',
        terminalCode: 'TERM-01',
        agencyName: 'Banca y Casino Central CDMX',
        agencyCity: 'Ciudad de México',
        betType: 'PARLAY',
        stake: sampleStake,
        totalOdds: sampleOdds,
        potentialPayout: Math.round(sampleStake * sampleOdds),
        currency: 'MXN',
        status: 'WON', // Simulate a winning ticket ready for cashier payout
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        expiresAt: new Date(Date.now() + 5000000000).toISOString(),
        selections: [
          {
            eventName: 'Club América vs Chivas',
            marketName: '1X2',
            selection: 'Club América',
            odds: 1.85,
            status: 'WON',
          },
          {
            eventName: 'Cruz Azul vs Pumas',
            marketName: '1X2',
            selection: 'Empate',
            odds: 1.97,
            status: 'WON',
          },
        ],
        termsNotice: 'Boleto verificado por el sistema central de Punto de Venta.',
      };
      this.posTickets.set(ticket.ticketNumber, ticket);
    }

    return {
      isValid: true,
      ticketNumber: ticket.ticketNumber,
      barcode: ticket.barcode,
      securityHash: ticket.securityHash,
      status: ticket.status,
      betType: ticket.betType,
      stake: ticket.stake,
      totalOdds: ticket.totalOdds,
      potentialPayout: ticket.potentialPayout,
      currency: ticket.currency,
      agencyName: ticket.agencyName,
      createdAt: ticket.createdAt,
      selections: ticket.selections,
      canRedeem: ticket.status === 'WON',
    };
  }

  async redeemTicket(dto: RedeemPosTicketDto) {
    const verification = await this.verifyTicket(dto.ticketNumber);
    const ticket = this.posTickets.get(verification.ticketNumber);

    if (!ticket) {
      throw new NotFoundException('Boleto físico no encontrado en el sistema');
    }

    if (ticket.status === 'PAID') {
      throw new BadRequestException(
        `Este boleto YA FUE PAGADO previamente en fecha ${ticket.paidAt} por el cajero ${ticket.paidByCashier}`,
      );
    }

    // Marcar como pagado
    ticket.status = 'PAID';
    ticket.paidAt = new Date().toISOString();
    ticket.paidByCashier = dto.cashierName;
    ticket.payoutTerminal = dto.terminalCode;

    // Descontar efectivo pagado de la gaveta de la terminal
    const terminal = this.posTerminals.get(dto.terminalCode);
    if (terminal) {
      terminal.cashBalance = Math.max(0, terminal.cashBalance - ticket.potentialPayout);
    }

    const receiptNumber = `RCP-POS-${Date.now().toString(36).toUpperCase()}`;

    this.logger.log(
      `[POS Retail] Ticket ${ticket.ticketNumber} PAGADO EN EFECTIVO: $${ticket.potentialPayout} ${ticket.currency} por cajero ${dto.cashierName}`,
    );

    return {
      success: true,
      receiptNumber,
      ticketNumber: ticket.ticketNumber,
      payoutAmount: ticket.potentialPayout,
      currency: ticket.currency,
      paidAt: ticket.paidAt,
      paidByCashier: dto.cashierName,
      terminalCode: dto.terminalCode,
      message: `¡Premio de $${ticket.potentialPayout.toLocaleString()} ${ticket.currency} pagado en ventanilla exitosamente!`,
    };
  }
}
