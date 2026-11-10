import React, { useState } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'farmaceutico' | 'medico' | 'enfermero';
  specialty?: string;
  medicalReg?: string;
  ips: string;
}

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(true);

  // Advanced Registration state
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [specialty, setSpecialty] = useState('Farmacia Clínica');
  const [roleSelection, setRoleSelection] = useState<'farmaceutico' | 'medico' | 'enfermero'>('farmaceutico');
  const [medicalReg, setMedicalReg] = useState('');
  const [selectedIps, setSelectedIps] = useState('Centro Médico de Especialistas Clínica Santillana');

  const ipsList = [
    { id: 'ips-1', name: 'Centro Médico de Especialistas Clínica Santillana' },
    { id: 'ips-2', name: 'Hospital Departamental Universitario' },
    { id: 'ips-3', name: 'Clínica de la Presentación' },
    { id: 'ips-4', name: 'Hospital Infantil de Caldas' },
  ];

  // Load remembered user
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('miconciliacion_remembered_email');
    const savedPassword = localStorage.getItem('miconciliacion_remembered_password');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Quick delay simulation for UX feedback
    await new Promise((r) => setTimeout(r, 450));

    // Master Bypass credentials identical to FarmaProa
    const isMasterBypass =
      (email.trim().toLowerCase() === 'mauriciosuazag@hotmail.com' ||
       email.trim().toLowerCase() === 'mausugu' ||
       email.trim().toLowerCase() === 'mausugu@santillana.com' ||
       email.trim().toLowerCase() === 'mausugu@conciliacion.com') &&
      (password === '123456' || password === 'FarmaProa2026**' || password === 'admin');

    const isAdminBypass =
      (email.trim().toLowerCase() === 'admin@conciliacion.com' || email.trim().toLowerCase() === 'admin@proa.com' || email.trim().toLowerCase() === 'farmacia@santillana.com') &&
      (password === 'admin' || password === '123456');

    if (isSignUp) {
      if (!fullName || !idNumber || !medicalReg || !email || !password) {
        setError('Por favor complete todos los campos obligatorios del registro.');
        setLoading(false);
        return;
      }

      const newUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: fullName,
        email,
        role: roleSelection,
        specialty,
        medicalReg,
        ips: selectedIps,
      };

      localStorage.setItem('miconciliacion_user', JSON.stringify(newUser));
      setMessage('¡Registro completado con éxito! Iniciando sesión...');
      setTimeout(() => {
        onLoginSuccess(newUser);
      }, 700);
      return;
    }

    if (isMasterBypass || isAdminBypass) {
      if (rememberEmail) {
        localStorage.setItem('miconciliacion_remembered_email', email);
        localStorage.setItem('miconciliacion_remembered_password', password);
      } else {
        localStorage.removeItem('miconciliacion_remembered_email');
        localStorage.removeItem('miconciliacion_remembered_password');
      }

      const activeUser: AuthUser = {
        id: 'usr-santillana-01',
        name: isMasterBypass ? 'Dr. Mauricio Suaza G.' : 'Dra. Marcela Cardona H.',
        email,
        role: 'farmaceutico',
        specialty: 'Farmacia Clínica / PROA & Conciliación',
        medicalReg: 'Reg. #84920',
        ips: 'Centro Médico de Especialistas Clínica Santillana',
      };

      localStorage.setItem('miconciliacion_user', JSON.stringify(activeUser));
      setLoading(false);
      onLoginSuccess(activeUser);
      return;
    }

    if (!email || !password) {
      setError('Por favor ingrese correo electrónico y contraseña.');
      setLoading(false);
      return;
    }

    // Default authenticated session
    if (rememberEmail) {
      localStorage.setItem('miconciliacion_remembered_email', email);
      localStorage.setItem('miconciliacion_remembered_password', password);
    } else {
      localStorage.removeItem('miconciliacion_remembered_email');
      localStorage.removeItem('miconciliacion_remembered_password');
    }

    const standardUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role: 'farmaceutico',
      specialty: 'Farmacoterapéutica Clínica',
      medicalReg: 'Reg. #RM-Santillana',
      ips: 'Centro Médico de Especialistas Clínica Santillana',
    };

    localStorage.setItem('miconciliacion_user', JSON.stringify(standardUser));
    setLoading(false);
    onLoginSuccess(standardUser);
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor ingrese su correo electrónico para recibir el enlace.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage(`Se ha transmitido un enlace seguro de restablecimiento a ${email}. Revise su bandeja.`);
      setIsRecovery(false);
    }, 600);
  };

  const handleDemoMode = () => {
    setLoading(true);
    const demoUser: AuthUser = {
      id: 'usr-demo',
      name: 'Dra. Marcela Cardona H. (Demo)',
      email: 'demo@santillana.com',
      role: 'farmaceutico',
      specialty: 'Farmacia Clínica Especializada',
      medicalReg: 'Reg. #8492',
      ips: 'Centro Médico de Especialistas Clínica Santillana',
    };
    localStorage.setItem('miconciliacion_user', JSON.stringify(demoUser));
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(demoUser);
    }, 300);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f0f4f9] via-[#f8f9ff] to-[#e6efff] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#bfc7d2]/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="bg-[#eff4ff] p-6 sm:p-8 flex flex-col items-center justify-center border-b border-[#bfc7d2]/50 text-center">
          <div className="h-20 w-20 flex items-center justify-center mb-3">
            <svg
              className="h-full w-full rounded-2xl shadow-md p-1 bg-white"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="10" fill="#006194" />
              <path d="M24 10V38M10 24H38" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="24" cy="24" r="8" fill="#006194" stroke="#FFFFFF" strokeWidth="2.5" />
              <path d="M20 24L23 27L28 21" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="36" cy="12" r="3.5" fill="#EF4444" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-[#0b1c30] tracking-tight">Mi Conciliación RX</h1>
          <p className="text-[12px] font-bold text-[#006194] mt-0.5">by Quimera RX • Versión 1.0</p>
          <div className="flex items-center gap-1.5 mt-2 bg-[#dce9ff] px-2.5 py-1 rounded-full text-[10px] font-bold text-[#001d31] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#00694c] animate-pulse"></span>
            <span>Clínica Santillana • CDSS Interoperable</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleAuth} className="flex flex-col gap-5">
            {error && (
              <div className="bg-[#ffdad6] text-[#93000a] p-3.5 rounded-xl text-xs font-bold border border-[#ba1a1a]/30 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="bg-[#97f5cc]/30 text-[#00694c] p-3.5 rounded-xl text-xs font-bold border border-[#00694c]/30 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>{message}</span>
              </div>
            )}

            <div className="space-y-3.5">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email-field" className="text-[11px] font-black text-[#565e74] uppercase tracking-wider px-1">
                  Usuario o Correo Electrónico
                </label>
                <div className="relative group">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707881] material-symbols-outlined text-[20px] group-focus-within:text-[#006194] transition-colors">
                    mail
                  </span>
                  <input
                    id="email-field"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-11 pr-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#006194] focus:border-[#006194] transition-all outline-none text-[#0b1c30]"
                    placeholder="mausugu o usuario@santillana.com"
                    required
                  />
                </div>

                {!isSignUp && !isRecovery && (
                  <div className="flex items-center gap-2 px-1 mt-1.5">
                    <input
                      id="remember-email"
                      type="checkbox"
                      checked={rememberEmail}
                      onChange={(e) => setRememberEmail(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#006194] focus:ring-[#006194] cursor-pointer"
                    />
                    <label htmlFor="remember-email" className="text-[11px] font-semibold text-[#565e74] cursor-pointer select-none">
                      Recordar credenciales en este equipo
                    </label>
                  </div>
                )}
              </div>

              {/* Extended Sign Up Fields */}
              {isSignUp && (
                <div className="space-y-3 border-t border-b border-[#bfc7d2]/40 py-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#565e74] uppercase tracking-wider px-1">Nombre Completo</label>
                      <input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-9 px-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#006194]"
                        placeholder="Ej. Dra. Marcela Cardona"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#565e74] uppercase tracking-wider px-1">Identificación</label>
                      <input
                        required
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        className="w-full h-9 px-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#006194]"
                        placeholder="C.C. / ID"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#565e74] uppercase tracking-wider px-1">Rol Clínico</label>
                      <select
                        value={roleSelection}
                        onChange={(e) => setRoleSelection(e.target.value as any)}
                        className="w-full h-9 px-2 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#006194]"
                      >
                        <option value="farmaceutico">Farmacéutico Clínico</option>
                        <option value="medico">Médico Tratante / Internista</option>
                        <option value="enfermero">Enfermero(a) Bedside</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#565e74] uppercase tracking-wider px-1">Registro Profesional</label>
                      <input
                        required
                        value={medicalReg}
                        onChange={(e) => setMedicalReg(e.target.value)}
                        className="w-full h-9 px-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#006194]"
                        placeholder="Reg #8492"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#565e74] uppercase tracking-wider px-1">Institución / IPS</label>
                    <select
                      value={selectedIps}
                      onChange={(e) => setSelectedIps(e.target.value)}
                      className="w-full h-9 px-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#006194]"
                    >
                      {ipsList.map((ips) => (
                        <option key={ips.id} value={ips.name}>
                          {ips.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password-field" className="text-[11px] font-black text-[#565e74] uppercase tracking-wider px-1">
                  Contraseña de Acceso
                </label>
                <div className="relative group">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707881] material-symbols-outlined text-[20px] group-focus-within:text-[#006194] transition-colors">
                    lock
                  </span>
                  <input
                    id="password-field"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-11 pr-11 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#006194] focus:border-[#006194] transition-all outline-none text-[#0b1c30]"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#707881] hover:text-[#0b1c30] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>

                {!isSignUp && !isRecovery && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsRecovery(true)}
                      className="text-[11px] font-bold text-[#006194] hover:underline"
                    >
                      ¿Olvidó su contraseña?
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {isRecovery ? (
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleRecovery}
                  disabled={loading}
                  className="w-full h-11 bg-[#006194] hover:bg-[#007bb9] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                  ) : (
                    <>
                      <span>Enviar Instrucciones</span>
                      <span className="material-symbols-outlined text-[16px]">send</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsRecovery(false)}
                  className="text-center text-xs font-bold text-[#565e74] hover:text-[#0b1c30]"
                >
                  Regresar al Inicio de Sesión
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#006194] hover:bg-[#007bb9] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                ) : (
                  <>
                    <span>{isSignUp ? 'Crear Registro Profesional' : 'Ingresar al Sistema'}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </>
                )}
              </button>
            )}

            <div className="flex items-center gap-3 py-1">
              <div className="h-px grow bg-[#bfc7d2]/50"></div>
              <span className="text-[10px] font-black text-[#707881] uppercase tracking-widest">O</span>
              <div className="h-px grow bg-[#bfc7d2]/50"></div>
            </div>

            {/* Demo / Fast access Button */}
            <button
              type="button"
              onClick={handleDemoMode}
              className="w-full h-11 bg-white hover:bg-[#eff4ff] text-[#006194] border border-[#006194]/40 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-[#00694c]">science</span>
              <span>Explorar con Caso Clínico Demo</span>
            </button>

            <p className="text-center text-xs font-semibold text-[#565e74]">
              {isSignUp ? '¿Ya tiene cuenta habilitada? ' : '¿Es profesional nuevo en el centro? '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#006194] font-bold hover:underline ml-1"
              >
                {isSignUp ? 'Iniciar Sesión' : 'Solicitar Acceso'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
