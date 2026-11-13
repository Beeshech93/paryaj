import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const AGENCIES = {
  MX: [
    {
      id: 'AG-MX-01',
      name: 'Banca y Casino Central CDMX',
      city: 'Ciudad de México',
      address: 'Av. Masaryk 102, Miguel Hidalgo',
      phone: '+52 55 1234 5678',
      terminal: 'TERM-MX-01',
      status: 'OPERATIONAL',
      currency: 'MXN',
    },
    {
      id: 'AG-MX-02',
      name: 'Agencia Plaza Minerva Guadalajara',
      city: 'Guadalajara',
      address: 'Av. Vallarta 2440, Arcos Vallarta',
      phone: '+52 33 2345 6789',
      terminal: 'TERM-MX-02',
      status: 'OPERATIONAL',
      currency: 'MXN',
    },
    {
      id: 'AG-MX-03',
      name: 'Sucursal San Pedro Garza García',
      city: 'Monterrey',
      address: 'Calzada San Pedro 401',
      phone: '+52 81 3456 7890',
      terminal: 'TERM-MX-03',
      status: 'OPERATIONAL',
      currency: 'MXN',
    },
  ],
  HT: [
    {
      id: 'AG-HT-01',
      name: 'Banca Paryaj Delmas 33',
      city: 'Port-au-Prince',
      address: 'Angle Rue Delmas 33',
      phone: '+509 3700 1234',
      terminal: 'TERM-HT-01',
      status: 'OPERATIONAL',
      currency: 'HTG',
    },
    {
      id: 'AG-HT-02',
      name: 'Kiosk Pétion-Ville Saint-Pierre',
      city: 'Pétion-Ville',
      address: 'Rue Panamericaine',
      phone: '+509 3800 5678',
      terminal: 'TERM-HT-02',
      status: 'OPERATIONAL',
      currency: 'HTG',
    },
    {
      id: 'AG-HT-03',
      name: 'Banca Cap-Haïtien Boulevard',
      city: 'Cap-Haïtien',
      address: 'Boulevard du Bord de Mer',
      phone: '+509 3900 9012',
      terminal: 'TERM-HT-03',
      status: 'OPERATIONAL',
      currency: 'HTG',
    },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || 'MX';
  const list = AGENCIES[country as 'MX' | 'HT'] || AGENCIES.MX;

  return NextResponse.json({
    status: 'ok',
    country,
    count: list.length,
    agencies: list,
  });
}
