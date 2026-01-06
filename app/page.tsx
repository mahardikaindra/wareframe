'use client';
import { useState } from 'react';
import { 
  User, 
  Lock, 
  Phone, 
  CreditCard, 
  Home as HomeIcon, 
  Settings, 
  FileText, 
  ChevronLeft,
  CheckCircle2,
  LogOut,
  ArrowRight,
  Mail,
  Clock,
  Trash2,
  Info,
  Layers,
  Upload,
  File,
  X,
  Paperclip,
  Download,
  Building,
  CreditCard as PaymentIcon,
  Inbox,
  Shield} from 'lucide-react';

// --- Helper Components ---

const StatusBadge = ({ status }) => {
  const styles = {
    'Selesai': 'bg-[#dad7cd] text-[#344e41] border-[#a3b18a]',
    'Diproses': 'bg-amber-50 text-amber-700 border-amber-100',
    'Ditolak': 'bg-red-50 text-red-600 border-red-100',
    'default': 'bg-gray-50 text-gray-500 border-gray-100'
  };
  const style = styles[status] || styles.default;
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${style}`}>
      {status}
    </span>
  );
};

const App = () => {
  // State Navigasi
  const [page, setPage] = useState('login'); 
  const [submissionType, setSubmissionType] = useState(''); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [historyTab, setHistoryTab] = useState('Semua');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // State untuk Multiple Submission
  const [businesses, setBusinesses] = useState([]);
  const [currentBusiness, setCurrentBusiness] = useState({ 
    name: '', 
    entityType: 'PT',
    hasEmail: 'Tidak', // Default: Belum punya
    email: '',
    emailPassword: '',
    address: '',
    kbliCount: 1, // Default: 1 KBLI
    price: 100000, // Default price for 1-8 KBLI
    files: [] 
  });
  
  // Simulasi Pembayaran
  const [isPaid, setIsPaid] = useState(false);

  // Mock Data Riwayat Pengajuan
  const historyData = [
    { 
      id: 1, 
      type: 'NPWP + NIB', 
      client: 'PT. Maju Bersama', 
      date: '12 Des 2025', 
      status: 'Selesai',
      isPaid: false, 
      total: 1500000,
      items: [
        { id: 101, name: 'PT. Maju Bersama Utama', kbliCount: 8, price: 100000, files: 2 },
        { id: 102, name: 'PT. Maju Logistik', kbliCount: 12, price: 200000, files: 1 },
      ],
      result: {
        files: [
          { name: 'NIB_2025_MAJU_BERSAMA.pdf', type: 'NIB', date: '12/12/2025' },
          { name: 'NPWP_BADAN_MAJU_BERSAMA.pdf', type: 'NPWP', date: '12/12/2025' },
        ],
        email: 'admin@majubersama.com',
        emailPass: 'Maju123!',
        ossUser: 'OSS_MAJU_99',
        ossPass: 'Bersama2025@'
      }
    }
  ];

  // Logika Perhitungan Biaya KBLI (100rb per 8 KBLI)
  const calculatePrice = (count) => {
    return Math.ceil(count / 8) * 100000;
  };

  const handleKBLIChange = (val) => {
    const count = parseInt(val) || 0;
    setCurrentBusiness({ 
      ...currentBusiness, 
      kbliCount: count, 
      price: calculatePrice(count) 
    });
  };

  const handleFileUpload = () => {
    const mockFiles = ['KTP_Direktur.pdf', 'Akta_Pendirian.pdf', 'Domisili_Usaha.jpg'];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    if (!currentBusiness.files.find(f => f.name === randomFile)) {
      setCurrentBusiness({
        ...currentBusiness,
        files: [...currentBusiness.files, { name: randomFile, size: '1.2 MB' }]
      });
    }
  };

  const removeFile = (fileName) => {
    setCurrentBusiness({
      ...currentBusiness,
      files: currentBusiness.files.filter(f => f.name !== fileName)
    });
  };

  const addBusiness = () => {
    const isEmailValid = currentBusiness.hasEmail === 'Ya' ? (currentBusiness.email && currentBusiness.emailPassword) : true;
    
    if (currentBusiness.name && currentBusiness.kbliCount > 0 && isEmailValid && currentBusiness.address) {
      setBusinesses([...businesses, { ...currentBusiness, id: Date.now() }]);
      setCurrentBusiness({ 
        name: '', 
        entityType: 'PT',
        hasEmail: 'Tidak',
        email: '',
        emailPassword: '',
        address: '',
        kbliCount: 1, 
        price: 100000, 
        files: [] 
      });
    }
  };

  const removeBusiness = (id) => {
    setBusinesses(businesses.filter(b => b.id !== id));
  };

  const totalPrice = businesses.reduce((sum, item) => sum + item.price, 0);

  const navigate = (target) => {
    setPage(target);
    window.scrollTo(0, 0);
  };

  const handleSubmissionStart = (type) => {
    setSubmissionType(type);
    setBusinesses([]);
    setPage('submission');
  };

  const openHistoryDetail = (item) => {
    setSelectedSubmission(item);
    setIsPaid(item.isPaid);
    setPage('history-detail');
  };

  const finalizeSubmission = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('home');
    }, 2000);
  };

  const processPayment = () => {
    setIsPaid(true);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // --- UI Components ---

  const Header = ({ title, showBack = false, backTarget = 'home' }) => (
    <div className="bg-[#344e41] text-white h-16 px-5 flex items-center sticky top-0 z-40 shadow-sm w-full">
      {showBack && (
        <button onClick={() => navigate(backTarget)} className="mr-3 p-2 -ml-2 active:bg-[#3a5a40] rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
      )}
      <h1 className="text-lg font-bold flex-1 truncate">{title}</h1>
    </div>
  );

  const BottomNav = () => (
    <div className="bg-white border-t border-gray-100 h-20 flex justify-around items-center sticky bottom-0 w-full z-40 px-6">
      <button 
        onClick={() => navigate('home')} 
        className={`flex flex-col items-center gap-1.5 p-2 transition-all ${['home', 'submission'].includes(page) ? 'text-[#344e41] scale-105' : 'text-gray-400 opacity-70'}`}
      >
        <HomeIcon size={24} strokeWidth={page === 'home' ? 2.5 : 2} />
        <span className="text-[10px] font-black uppercase tracking-widest">Beranda</span>
      </button>
      <button 
        onClick={() => navigate('profile')} 
        className={`flex flex-col items-center gap-1.5 p-2 transition-all ${['profile', 'personal-info', 'history', 'history-detail'].includes(page) ? 'text-[#344e41] scale-105' : 'text-gray-400 opacity-70'}`}
      >
        <User size={24} strokeWidth={['profile', 'personal-info', 'history', 'history-detail'].includes(page) ? 2.5 : 2} />
        <span className="text-[10px] font-black uppercase tracking-widest">Profil</span>
      </button>
    </div>
  );

  const InputField = ({ icon: Icon, label, placeholder, value, onChange, type = "text", isTextArea = false, readOnly = false }) => {
    const inputClasses = `block w-full ${Icon && !isTextArea ? 'pl-11' : 'pl-5'} pr-5 py-4 rounded-xl border border-gray-200 outline-none transition-all focus:ring-2 focus:ring-[#344e41]/10 focus:border-[#344e41] ${readOnly ? 'bg-gray-50 text-gray-500 border-gray-100' : 'bg-white text-gray-900 shadow-sm'}`;
    
    const commonProps = {
      placeholder,
      onChange,
      readOnly,
      className: inputClasses,
      value: value || ''
    };

    return (
      <div className="mb-6 text-left w-full">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-2 ml-1">{label}</label>
        <div className="relative">
          {Icon && !isTextArea && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Icon size={20} />
            </div>
          )}
          {isTextArea ? (
            <textarea {...commonProps} rows={3} className={`${inputClasses} resize-none`} />
          ) : (
            <input type={type} {...commonProps} />
          )}
        </div>
      </div>
    );
  };

  // --- Auth Pages ---
  const RegisterPage = () => (
    <div className="bg-white min-h-full flex flex-col font-sans text-left">
      <Header title="Buat Akun" showBack={true} backTarget="login" />
      <div className="p-6 flex-1">
        <div className="mb-8 mt-4">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Daftar Akun Baru</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Lengkapi data profesional Anda</p>
        </div>
        
        <InputField label="Nama Lengkap" placeholder="Budi Santoso, S.H." />
        <InputField icon={Shield} label="NIK (Sesuai KTP)" placeholder="3273xxxxxxxxxxxx" type="number" />
        <InputField icon={Phone} label="Nomor Telepon" placeholder="08xxxx" />
        <InputField icon={Lock} label="Kata Sandi" placeholder="••••••••" type="password" />
        
        <div className="mt-8">
          <button onClick={() => navigate('home')} className="w-full h-14 bg-[#344e41] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#344e41]/10 active:scale-95 transition-all">Daftar Sekarang</button>
        </div>
        
        <p className="text-center mt-8 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
          Sudah punya akun? <button onClick={() => navigate('login')} className="text-[#344e41] ml-1">Masuk</button>
        </p>
      </div>
    </div>
  );

  const ForgotPasswordPage = () => (
    <div className="bg-white min-h-full flex flex-col font-sans text-left">
      <Header title="Lupa Password" showBack={true} backTarget="login" />
      <div className="p-6 flex-1">
        <div className="mb-10 mt-4">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Atur Ulang Sandi</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Kami akan mengirimkan kode OTP</p>
        </div>
        
        <InputField icon={Phone} label="Nomor Telepon Terdaftar" placeholder="08xxxx" />
        
        <div className="mt-6">
          <button onClick={() => navigate('login')} className="w-full h-14 bg-[#344e41] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#344e41]/10 active:scale-95 transition-all">Kirim Kode Verifikasi</button>
        </div>
      </div>
    </div>
  );

  const LoginPage = () => (
    <div className="p-6 flex flex-col min-h-full bg-white text-center">
      <div className="mb-12 mt-12 flex flex-col items-center">
        <div className="w-20 h-20 bg-[#344e41] rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-[#344e41]/10 text-white">
          <Layers size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">E-Legalitas</h2>
        <p className="text-gray-500 text-sm mt-1 font-medium">Layanan Perizinan Profesional</p>
      </div>
      <InputField icon={Phone} label="Nomor Telepon" placeholder="08xxxx" />
      <InputField icon={Lock} label="Kata Sandi" placeholder="••••••••" type="password" />
      <div className="flex justify-end mb-8">
        <button onClick={() => navigate('forgot-password')} className="text-[#344e41] text-xs font-black uppercase tracking-widest hover:text-[#3a5a40]">Lupa Password?</button>
      </div>
      <button onClick={() => navigate('home')} className="w-full h-14 bg-[#344e41] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#344e41]/10 active:scale-95 transition-all">Masuk</button>
      <p className="text-center mt-auto py-8 text-gray-400 text-xs font-bold uppercase tracking-widest">
        Baru di sini? <button onClick={() => navigate('register')} className="text-[#344e41] ml-1">Buat Akun</button>
      </p>
    </div>
  );

  const SubmissionPage = () => (
    <div className="bg-gray-50 min-h-full flex flex-col font-sans text-left relative">
      <Header title={`Pengajuan ${submissionType}`} showBack={true} />
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-60">
        <div className="p-6">
          <div className="bg-white p-6 rounded-2xl border border-[#dad7cd] shadow-sm mb-8 text-left">
            <h4 className="text-sm font-black text-gray-900 mb-6 flex items-center gap-2.5">
              <Building size={20} className="text-[#344e41]" /> Profil Bisnis
            </h4>
            
            <InputField label="Nama Badan Usaha" placeholder="Misal: PT Maju Jaya" value={currentBusiness.name} onChange={(e) => setCurrentBusiness({...currentBusiness, name: e.target.value})} />
            
            <div className="mb-6">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-2 ml-1">Jenis Entitas</label>
              <div className="relative">
                <select 
                  value={currentBusiness.entityType} 
                  onChange={(e) => setCurrentBusiness({...currentBusiness, entityType: e.target.value})} 
                  className="block w-full px-5 h-14 rounded-xl border border-gray-200 bg-white text-sm font-bold outline-none shadow-sm focus:ring-2 focus:ring-[#344e41]/10 appearance-none"
                >
                  <option value="PT">PT (Perseroan Terbatas)</option>
                  <option value="CV">CV (Persekutuan Komanditer)</option>
                  <option value="Firma">Firma / Persekutuan</option>
                  <option value="Perorangan">Usaha Perorangan</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><ChevronLeft size={18} className="-rotate-90" /></div>
              </div>
            </div>

            {/* FIELD EMAIL: BARU */}
            <div className="mb-6">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-2 ml-1">Sudah punya email OSS?</label>
              <div className="grid grid-cols-2 gap-3">
                {['Ya', 'Tidak'].map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => setCurrentBusiness({...currentBusiness, hasEmail: opt})}
                    className={`h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${currentBusiness.hasEmail === opt ? 'bg-[#344e41] text-white border-[#344e41]' : 'bg-white text-gray-400 border-gray-100 hover:border-[#dad7cd]'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {currentBusiness.hasEmail === 'Ya' ? (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <InputField icon={Mail} label="Email Korespondensi" placeholder="klien@gmail.com" value={currentBusiness.email} onChange={(e) => setCurrentBusiness({...currentBusiness, email: e.target.value})} />
                <InputField icon={Lock} label="Kata Sandi Email" placeholder="••••••••" type="password" value={currentBusiness.emailPassword} onChange={(e) => setCurrentBusiness({...currentBusiness, emailPassword: e.target.value})} />
              </div>
            ) : (
              <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3 animate-in fade-in">
                <Info size={18} className="text-[#344e41] flex-shrink-0" />
                <p className="text-[10px] font-bold text-[#344e41] leading-relaxed">Sistem kami akan membuatkan email profesional baru untuk keperluan OSS Anda secara otomatis.</p>
              </div>
            )}

            <InputField label="Alamat Domisili" isTextArea={true} placeholder="Masukkan alamat lengkap..." value={currentBusiness.address} onChange={(e) => setCurrentBusiness({...currentBusiness, address: e.target.value})} />
            
            {/* FIELD KBLI & HARGA: BARU */}
            <div className="mb-6">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-2 ml-1">Jumlah KBLI</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Layers size={20} />
                </div>
                <input 
                  type="number" 
                  min="1"
                  className="block w-full pl-11 pr-5 py-4 rounded-xl border border-gray-200 outline-none transition-all focus:ring-2 focus:ring-[#344e41]/10 focus:border-[#344e41] bg-white text-gray-900 shadow-sm"
                  placeholder="Contoh: 8"
                  value={currentBusiness.kbliCount}
                  onChange={(e) => handleKBLIChange(e.target.value)}
                />
              </div>
              <p className="text-[9px] font-bold text-gray-400 mt-2 ml-1 italic uppercase tracking-tighter">*Biaya Rp 100.000 per 8 KBLI</p>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-3 ml-1">Unggah Dokumen</label>
              <div className="p-6 bg-[#dad7cd]/20 rounded-xl border-2 border-dashed border-[#a3b18a] text-center">
                <button type="button" onClick={handleFileUpload} className="w-full flex flex-col items-center justify-center py-2 active:scale-95 transition-all">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md mb-3 text-[#344e41] border border-[#dad7cd]"><Upload size={24}/></div>
                  <span className="text-[10px] font-black text-[#344e41] uppercase tracking-widest">Pilih Berkas</span>
                </button>
                
                {currentBusiness.files.length > 0 && (
                  <div className="mt-5 space-y-2 text-left">
                    {currentBusiness.files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#dad7cd] text-[10px] shadow-sm">
                        <div className="flex items-center gap-3 font-bold text-gray-700">
                          <Paperclip size={14} className="text-[#344e41]" />
                          <span className="truncate max-w-[140px]">{file.name}</span>
                        </div>
                        <button onClick={() => removeFile(file.name)} className="text-red-500 p-1.5 hover:bg-red-50 rounded-md"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button onClick={addBusiness} disabled={!currentBusiness.name || currentBusiness.kbliCount < 1} className="w-full h-14 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all disabled:bg-gray-100 disabled:text-gray-300">
              Tambahkan ke Paket
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2">Item Dalam Paket ({businesses.length})</h4>
            {businesses.length === 0 ? (
              <div className="py-12 bg-white rounded-2xl border border-dashed border-gray-100 flex flex-col items-center justify-center opacity-60">
                 <Layers size={36} className="text-gray-200 mb-3"/>
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Belum ada item</p>
              </div>
            ) : (
              businesses.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#344e41]"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#dad7cd]/30 rounded-xl flex items-center justify-center text-[#344e41]"><Building size={24} /></div>
                    <div className="text-left">
                      <p className="text-sm font-black text-gray-800 tracking-tight">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-black text-[#344e41] bg-[#dad7cd] px-2 py-0.5 rounded-md uppercase tracking-tighter">{item.kbliCount} KBLI</span>
                        <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tighter">Rp {item.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeBusiness(item.id)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center active:bg-red-100 transition-all"><Trash2 size={18} /></button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 pt-5 pb-8 shadow-[0_-15px_40px_rgba(0,0,0,0.06)] z-50">
         <div className="max-w-[390px] mx-auto flex flex-col gap-4">
            {businesses.length > 0 && (
              <div className="flex justify-between items-center px-2">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Estimasi Tagihan</span>
                 <span className="text-2xl font-black text-[#344e41] tracking-tighter">Rp {totalPrice.toLocaleString()}</span>
              </div>
            )}
            <button 
               onClick={finalizeSubmission} 
               disabled={businesses.length === 0} 
               className={`w-full h-16 rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3
                 ${businesses.length === 0 ? 'bg-gray-100 text-gray-400 shadow-none' : 'bg-[#344e41] text-white shadow-[#344e41]/10'}`}
            >
              Ajukan Sekarang <ArrowRight size={20} />
            </button>
         </div>
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="bg-gray-50 min-h-full pb-20 text-left font-sans">
      <div className="bg-[#344e41] p-6 rounded-b-3xl shadow-xl">
        <div className="flex justify-between items-start mb-10">
          <div className="text-left">
            <p className="text-[#dad7cd] text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Selamat Datang,</p>
            <h2 className="text-white text-2xl font-black tracking-tight leading-none">Budi Santoso, S.H.</h2>
          </div>
          <button onClick={() => navigate('profile')} className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30 text-white shadow-lg"><User size={24} /></button>
        </div>
        <button onClick={() => navigate('history')} className="w-full bg-white p-5 rounded-2xl text-left flex justify-between items-center active:scale-95 transition-all shadow-xl shadow-[#344e41]/10">
          <div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.1em] mb-1.5">Update Pengajuan</p>
            <span className="font-black text-gray-800 text-sm flex items-center gap-2">1 Berkas Siap Pembayaran <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div></span>
          </div>
          <div className="bg-[#dad7cd]/20 p-2 rounded-full text-[#344e41]"><ArrowRight size={20} /></div>
        </button>
      </div>
      
      <div className="p-7 -mt-4 text-left">
        <h3 className="font-black text-gray-900 mb-6 text-xs uppercase tracking-[0.2em] opacity-40">Kategori Layanan</h3>
        <div className="grid grid-cols-1 gap-5">
          {[
            { id: 'NIB', color: 'orange', icon: FileText, title: 'NIB', desc: 'Nomor Induk Berusaha' },
            { id: 'NPWP', color: 'sage', icon: CreditCard, title: 'NPWP', desc: 'Pajak Badan & Pribadi' },
            { id: 'NPWP + NIB', color: 'purple', icon: Layers, title: 'Bundle NIB + NPWP', desc: 'Paket Pendirian Lengkap' }
          ].map((item) => (
            <button key={item.id} onClick={() => handleSubmissionStart(item.id)} className="flex items-center p-5 bg-white rounded-2xl shadow-sm border border-gray-50 active:scale-95 transition-all group text-left">
              <div className={`w-14 h-14 ${item.color === 'sage' ? 'bg-[#dad7cd]/40 text-[#344e41]' : `bg-${item.color}-50 text-${item.color}-600`} rounded-xl flex items-center justify-center mr-5 transition-colors group-hover:bg-[#dad7cd]/60`}><item.icon size={28} /></div>
              <div className="flex-1"><p className="font-black text-gray-800 text-base tracking-tight">{item.title}</p><p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.desc}</p></div>
              <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-[#dad7cd]/40 group-hover:text-[#344e41] transition-all"><ArrowRight size={16} /></div>
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );

  const HistoryPage = () => {
    const filteredHistory = historyData.filter(i => historyTab === 'Semua' || i.status === historyTab);

    return (
      <div className="bg-gray-50 min-h-full pb-20 font-sans text-left">
        <Header title="Daftar Pengajuan" showBack={true} backTarget="profile" />
        <div className="bg-white px-4 py-4 sticky top-[64px] border-b border-gray-100 shadow-sm z-30 flex gap-2.5 overflow-x-auto no-scrollbar">
          {['Semua', 'Diproses', 'Selesai', 'Ditolak'].map(tab => (
            <button key={tab} onClick={() => setHistoryTab(tab)} className={`px-6 h-10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${historyTab === tab ? 'bg-[#344e41] text-white shadow-lg shadow-[#344e41]/10' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>{tab}</button>
          ))}
        </div>
        
        <div className="p-6 space-y-5 text-left min-h-[400px]">
          {filteredHistory.length > 0 ? (
            filteredHistory.map(item => (
              <div key={item.id} onClick={() => openHistoryDetail(item)} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 active:scale-98 transition-all cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="text-left">
                    <span className="text-[9px] font-black text-[#344e41] bg-[#dad7cd] px-2.5 py-1 rounded-md uppercase tracking-[0.1em]">{item.type}</span>
                    <h4 className="font-black text-gray-900 mt-2.5 text-lg leading-tight tracking-tight">{item.client}</h4>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={item.status} />
                    {item.status === 'Selesai' && !item.isPaid && <div className="bg-red-50 text-red-600 text-[8px] font-black uppercase px-2 py-1 rounded-md tracking-widest animate-pulse">Pending Payment</div>}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-5 border-t border-gray-50 text-gray-400">
                  <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest"><Clock size={16} /><span>{item.date}</span></div>
                  <div className="flex items-center gap-1.5 text-[#344e41] text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">Detail <ArrowRight size={14} /></div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300 mb-6 border border-gray-50 shadow-inner">
                <Inbox size={48} strokeWidth={1.5} />
              </div>
              <h4 className="text-sm font-black text-gray-900 tracking-tight">Tidak Ada Data</h4>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-2 max-w-[200px] leading-relaxed">
                Daftar pengajuan dengan status <span className="text-[#344e41]">{historyTab}</span> belum tersedia saat ini.
              </p>
              {historyTab !== 'Semua' && (
                <button 
                  onClick={() => setHistoryTab('Semua')}
                  className="mt-6 text-[10px] font-black text-[#344e41] uppercase tracking-widest underline decoration-2 underline-offset-4"
                >
                  Lihat Semua
                </button>
              )}
            </div>
          )}
        </div>
        <BottomNav />
      </div>
    );
  };

  const HistoryDetailPage = () => {
    if (!selectedSubmission) return null;
    const item = selectedSubmission;

    return (
      <div className="bg-gray-50 min-h-full pb-40 font-sans text-left overflow-y-auto">
        <Header title={`Review Pengajuan`} showBack={true} backTarget="history" />
        
        <div className="p-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex justify-between items-center">
             <div className="text-left">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.15em] mb-1">Klien Terdaftar</p>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">{item.client}</h2>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">{item.date}</p>
             </div>
             <StatusBadge status={item.status} />
          </div>

          <section className="text-left">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Detail Paket Bisnis</h3>
            <div className="space-y-4">
              {item.items?.map(biz => (
                <div key={biz.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group">
                    <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-[#dad7cd]/40 group-hover:text-[#344e41] transition-all"><Building size={24}/></div>
                       <div className="text-left"><h4 className="text-base font-black text-gray-900 tracking-tight">{biz.name}</h4><p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">{biz.kbliCount} KBLI • Rp {biz.price.toLocaleString()}</p></div>
                    </div>
                </div>
              ))}
            </div>
          </section>

          {item.status === 'Selesai' && !isPaid && (
            <div className="bg-white p-8 rounded-2xl border-2 border-[#344e41] shadow-2xl shadow-[#344e41]/10 space-y-6 animate-in slide-in-from-bottom-8">
              <div className="flex items-center gap-4 text-[#344e41]"><div className="bg-[#344e41] text-white p-3 rounded-xl shadow-lg shadow-[#344e41]/10"><PaymentIcon size={28} /></div><h3 className="font-black uppercase tracking-[0.1em] text-sm">Penyelesaian Pembayaran</h3></div>
              <p className="text-[13px] text-gray-600 font-bold leading-relaxed">Selamat! Dokumen Anda sudah siap. Selesaikan pembayaran sekarang untuk mendapatkan akses instan.</p>
              <div className="py-5 border-y border-dashed border-gray-100 flex justify-between items-center">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Total Tagihan</span>
                <span className="text-2xl font-black text-[#344e41] tracking-tighter">Rp {item.total?.toLocaleString()}</span>
              </div>
              <button onClick={processPayment} className="w-full h-16 bg-[#344e41] text-white rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-[#344e41]/10 mt-6 active:scale-95 transition-all">Selesaikan Bayar</button>
            </div>
          )}

          {item.status === 'Selesai' && isPaid && item.result && (
            <div className="space-y-6 animate-in fade-in duration-1000">
               <div className="bg-[#344e41] p-6 rounded-2xl flex items-center gap-5 text-white shadow-xl shadow-[#344e41]/10">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center border border-white/30"><CheckCircle2 size={32} strokeWidth={3} /></div>
                  <div className="text-left"><h4 className="text-sm font-black uppercase tracking-widest">Pembayaran Lunas</h4><p className="text-[10px] opacity-80 font-bold uppercase mt-1 tracking-widest">Akses dokumen hasil dibuka</p></div>
               </div>
               
               <div className="bg-white p-7 rounded-2xl border border-gray-50 shadow-sm space-y-6 text-left">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b pb-4">Download Dokumen Resmi</h3>
                  {item.result.files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#dad7cd] transition-all group">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-11 h-11 bg-white p-2.5 rounded-xl flex items-center justify-center text-[#344e41] border border-gray-100 shadow-sm group-hover:bg-[#344e41] group-hover:text-white transition-all"><File size={22} /></div>
                        <div className="text-left">
                          <p className="text-[11px] font-black text-gray-800 tracking-tight">{file.name}</p>
                          <span className="text-[9px] text-[#344e41] font-black bg-[#dad7cd] px-2 py-0.5 rounded-md uppercase mt-1.5 inline-block">{file.type}</span>
                        </div>
                      </div>
                      <button className="p-3 text-[#344e41] bg-white border border-gray-100 rounded-xl shadow-sm active:scale-90"><Download size={20}/></button>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
        <BottomNav />
      </div>
    );
  };

  // --- Layout Wrapper ---

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4 font-sans text-left overflow-hidden">
      <div className="w-full max-w-[390px] h-[844px] bg-white rounded-[40px] shadow-2xl border-[12px] border-slate-900 overflow-hidden relative flex flex-col text-left">
        {/* Mobile Status Bar */}
        <div className="bg-white px-10 pt-6 pb-2 flex justify-between items-center text-[13px] font-black text-slate-900 z-50">
          <span>9:41</span>
          <div className="flex gap-2.5 items-center">
            <Layers size={14} />
            <div className="w-5 h-3 bg-slate-900 rounded-[3px]"></div>
          </div>
        </div>

        {/* content area */}
        <div className="flex-1 overflow-y-auto no-scrollbar text-left relative bg-white">
          {page === 'login' && <LoginPage />}
          {page === 'register' && <RegisterPage />}
          {page === 'forgot-password' && <ForgotPasswordPage />}
          {page === 'home' && <HomePage />}
          {page === 'submission' && <SubmissionPage />}
          {page === 'history' && <HistoryPage />}
          {page === 'history-detail' && <HistoryDetailPage />}
          {page === 'profile' && (
            <div className="bg-gray-50 min-h-full pb-20">
               <Header title="Akun Notaris" />
               <div className="bg-white p-8 flex flex-col items-center border-b text-center mb-6">
                  <div className="w-28 h-28 bg-[#dad7cd]/40 rounded-2xl flex items-center justify-center mb-5 border-4 border-white shadow-xl relative">
                    <User className="text-[#344e41]" size={56} />
                    <div className="absolute bottom-1 right-1 bg-[#344e41] p-2 rounded-xl border-2 border-white text-white shadow-lg"><Settings size={16} /></div>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Budi Santoso, S.H.</h2>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Bandung, Jawa Barat</p>
               </div>
               <div className="p-6 space-y-4">
                  {[
                    { id: 'personal-info', icon: User, title: 'Data Profesional' },
                    { id: 'history', icon: FileText, title: 'Riwayat Pengajuan' },
                    { id: 'login', icon: LogOut, title: 'Keluar Akun', danger: true }
                  ].map((btn) => (
                    <button key={btn.id} onClick={() => navigate(btn.id)} className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all active:scale-95 ${btn.danger ? 'bg-red-50/50 border-red-100 text-red-600' : 'bg-white border-gray-100 shadow-sm text-gray-800'}`}>
                      <div className="flex items-center gap-4"><div className={`p-3 rounded-xl ${btn.danger ? 'bg-red-100' : 'bg-[#dad7cd]/40 text-[#344e41]'}`}><btn.icon size={20} /></div><span className="font-black text-sm">{btn.title}</span></div>
                      {!btn.danger && <ArrowRight size={18} className="text-gray-300" />}
                    </button>
                  ))}
               </div>
               <BottomNav />
            </div>
          )}
          {page === 'personal-info' && (
            <div className="bg-gray-50 min-h-full pb-20 text-left">
               <Header title="Update Profil" showBack={true} backTarget="profile" />
               <div className="p-6">
                  <InputField label="Nama Lengkap" value="Budi Santoso, S.H., M.Kn." />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="NIK" value="3273012345678901" readOnly={true} />
                    <InputField label="No. SK" value="SK.123/AHU/2023" />
                  </div>
                  <InputField label="Wilayah Kedudukan" value="Kota Bandung" />
                  <InputField label="Email Kantor" value="notaris.budi@email.com" />
                  <InputField label="Alamat Kantor" isTextArea={true} value="Jl. Gatot Subroto No. 123, Bandung" />
                  <button onClick={() => {setShowSuccess(true); setTimeout(() => {setShowSuccess(false); navigate('profile');}, 1500);}} className="w-full h-16 bg-[#344e41] text-white rounded-xl font-black text-xs uppercase tracking-[0.3em] mt-6 shadow-2xl shadow-[#344e41]/10 active:scale-95 transition-all">Simpan Profil</button>
               </div>
            </div>
          )}
        </div>

        <div className="bg-white pb-3 pt-1 flex justify-center"><div className="w-32 h-1 bg-slate-200 rounded-full"></div></div>
      </div>
      
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-8 z-[100] text-center animate-in fade-in">
          <div className="bg-white w-full max-w-xs rounded-3xl p-12 shadow-2xl transform scale-100 zoom-in">
            <div className="w-24 h-24 bg-[#344e41] rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-[#344e41]/10"><CheckCircle2 size={56} /></div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Berhasil!</h3>
            <p className="text-gray-400 text-[10px] font-black mt-3 uppercase tracking-widest">Tindakan Disimpan</p>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-bottom { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation: fade-in 0.3s ease-out; }
        .slide-in-from-bottom-8 { animation: slide-in-bottom 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .zoom-in { animation: zoom-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
      `}</style>
    </div>
  );
};

export default App;