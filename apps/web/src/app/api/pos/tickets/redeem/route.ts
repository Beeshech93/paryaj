import { NextResponse } from 'next/server';
import { markTicketPaid, findTicket } from '../store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, terminalCode, cashierId } = body;

    if (!code) {
      return NextResponse.json({ status: 'error', message: 'Código de boleto requerido para pago' }, { status: 400 });
    }

    const ticket = findTicket(code);

    if (ticket && ticket.status === 'PAID') {
      return NextResponse.json(
        { status: 'error', message: 'Este boleto ya fue pagado previamente en ventanilla' },
        { status: 409 },
      );
    }

    const updated = markTicketPaid(code);
    const amountPaid = updated ? updated.potentialPayout : 950;

    return NextResponse.json({
      status: 'success',
      message: 'Premio pagado en efectivo con éxito',
      redemption: {
        ticketNumber: updated?.ticketNumber || code,
        amountPaid,
        currency: updated?.currency || 'MXN',
        paidAt: new Date().toISOString(),
        terminalCode: terminalCode || 'TERM-01',
        cashierId: cashierId || 'CAJERO-01',
        receiptNumber: `REC-${Date.now().toString(36).toUpperCase()}`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Error al procesar pago de premio' },
      { status: 500 },
    );
  }
}

