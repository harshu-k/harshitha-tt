import React from 'react';
import { X, Printer, Download, Award, ShieldCheck, CheckCircle2, Calendar } from 'lucide-react';

const CertificateViewerModal = ({ certificate, studentName, studentRollNumber, onClose }) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full my-6 flex flex-col overflow-hidden transition-all">
        {/* Controls Bar (hidden during print) */}
        <div className="p-4 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Official Certificate Viewer</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Verified platform credential document</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" /> Download / Print PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas / Sheet */}
        <div className="p-6 sm:p-12 bg-slate-100/70 dark:bg-slate-950/90 flex items-center justify-center transition-colors">
          <div className="w-full max-w-3xl bg-white border-8 border-double border-indigo-950 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden certificate-sheet text-slate-900">
            {/* Elegant Corner Filigree Accents */}
            <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-amber-500 rounded-tl-lg"></div>
            <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-amber-500 rounded-tr-lg"></div>
            <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-amber-500 rounded-bl-lg"></div>
            <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-amber-500 rounded-br-lg"></div>

            {/* Watermark Crest */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <Award className="w-96 h-96 text-indigo-950" />
            </div>

            {/* Certificate Header */}
            <div className="text-center space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Credential of Excellence
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-wide text-slate-900 mt-2">
                CERTIFICATE OF ACHIEVEMENT
              </h1>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                Student Skill & Internship Management System (SSIMS)
              </p>
            </div>

            {/* Certificate Body */}
            <div className="text-center my-8 space-y-4 relative z-10">
              <p className="text-xs text-slate-600 font-serif italic text-base">
                This prestigious credential is proudly presented to
              </p>

              <div className="py-2">
                <h2 className="text-2xl sm:text-3xl font-black text-indigo-900 tracking-tight font-serif uppercase border-b-2 border-slate-300 inline-block px-8 pb-1">
                  {studentName || 'Harshitha Rao'}
                </h2>
                {studentRollNumber && (
                  <p className="text-xs font-mono text-slate-500 font-bold mt-1">
                    Student ID / Roll No: {studentRollNumber}
                  </p>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
                in recognition of outstanding technical competence, verified proficiency, and successful credentialing in
              </p>

              <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 max-w-lg mx-auto">
                <h3 className="text-base sm:text-lg font-black text-indigo-950">
                  {certificate.title}
                </h3>
                <p className="text-xs font-bold text-indigo-700 mt-0.5">
                  Issued by: {certificate.issuingOrganization}
                </p>
              </div>
            </div>

            {/* Credential Details & Signatures */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center relative z-10">
              {/* Left: Issue Date & ID */}
              <div className="text-left space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Credential ID</div>
                <div className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded inline-block">
                  {certificate.credentialId || `SSIMS-CERT-${certificate.id || '982'}`}
                </div>
                <div className="text-[11px] text-slate-600 font-medium pt-1">
                  Date: {certificate.issueDate || 'October 2026'}
                </div>
              </div>

              {/* Center: Official Seal / Badge */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-lg ring-4 ring-amber-100 text-indigo-950">
                  <Award className="w-8 h-8 text-indigo-950" />
                </div>
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider mt-1.5">
                  OFFICIAL VERIFIED SEAL
                </span>
              </div>

              {/* Right: Signature */}
              <div className="text-right space-y-1">
                <div className="font-serif italic text-lg text-indigo-950 font-black">
                  Dr. Rajesh Sharma
                </div>
                <div className="w-32 border-b border-slate-400 ml-auto"></div>
                <div className="text-[10px] uppercase font-bold text-slate-500">
                  Head of Placement & Career Cell
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateViewerModal;
