'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/i18n/context';
import { X, Lock, Mail, User, ShieldCheck, CheckSquare, Square } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authMode, closeAuth, loginUser, market, setMarket, t } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(authMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync mode with prop
  React.useEffect(() => {
    setMode(authMode);
    setError(null);
  }, [authMode]);

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (mode === 'register') {
      if (!ageConfirmed) {
        setError('Debes ser mayor de 18 años para registrarte en la plataforma.');
        return;
      }
      if (!termsAccepted) {
        setError('Debes aceptar los Términos y Condiciones y la Política de Privacidad.');
        return;
      }
    }

    // Perform simulated login
    loginUser(email, name || email.split('@')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-brand-navy border border-brand-gold/40 shadow-2xl overflow-hidden text-white">
        {/* Modal Header */}
        <div className="p-4 bg-brand-dark border-b border-brand-navyLight flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-gold text-black flex items-center justify-center font-black text-sm">
              N
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {mode === 'login' ? 'Iniciar Sesión' : 'Registro de Cuenta'}
              </h3>
              <span className="text-[10px] text-brand-positive">Acceso a Plataforma Demo Regulada</span>
            </div>
          </div>
          <button
            onClick={closeAuth}
            className="p-1 rounded-lg hover:bg-brand-navyLight text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs: Iniciar Sesión / Registro */}
        <div className="grid grid-cols-2 border-b border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-3 text-center border-b-2 transition-colors ${
              mode === 'login'
                ? 'border-brand-gold text-brand-gold bg-brand-navyLight/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-3 text-center border-b-2 transition-colors ${
              mode === 'register'
                ? 'border-brand-gold text-brand-gold bg-brand-navyLight/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Crear Cuenta Demo
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-300">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-brand-dark border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-brand-dark border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-brand-dark border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          {/* Market / Country selection */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">País / Jurisdicción</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMarket('MX')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  market === 'MX'
                    ? 'bg-brand-navyLight border-brand-gold text-brand-gold font-bold'
                    : 'bg-brand-dark border-slate-800 text-slate-400'
                }`}
              >
                <span>🇲🇽 México</span>
              </button>
              <button
                type="button"
                onClick={() => setMarket('HT')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  market === 'HT'
                    ? 'bg-brand-navyLight border-brand-gold text-brand-gold font-bold'
                    : 'bg-brand-dark border-slate-800 text-slate-400'
                }`}
              >
                <span>🇭🇹 Haïti</span>
              </button>
            </div>
          </div>

          {/* Age and Legal check (Register mode) */}
          {mode === 'register' && (
            <div className="space-y-2 pt-2">
              <label className="flex items-start gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-brand-gold focus:ring-0"
                />
                <span className="text-[11px] leading-tight">
                  Confirmo que soy <strong>mayor de 18 años</strong> y tengo capacidad legal para
                  participar en plataformas de entretenimiento regulado.
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-brand-gold focus:ring-0"
                />
                <span className="text-[11px] leading-tight">
                  Acepto los Términos y Condiciones, las Políticas de Juego Responsable y la Política
                  de Privacidad.
                </span>
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-gold via-yellow-400 to-amber-300 text-black font-black text-sm uppercase tracking-wider hover:brightness-110 shadow-lg shadow-brand-gold/20 transition-all mt-4"
          >
            {mode === 'login' ? 'Entrar a mi Cuenta' : 'Completar Registro Gratuito'}
          </button>

          <p className="text-[10px] text-center text-slate-400 pt-1">
            🔒 Autenticación protegida compatible con Supabase Auth & MFA.
          </p>
        </form>
      </div>
    </div>
  );
};

