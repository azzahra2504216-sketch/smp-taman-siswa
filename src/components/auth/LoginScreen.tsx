
import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

type Mode = 'login' | 'register';
type Role = 'educator' | 'parent';

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [role, setRole] = useState<Role>('parent');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentNis, setStudentNis] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (!name.trim()) throw new Error('Nama wajib diisi.');

        const credential = await createUserWithEmailAndPassword(
          auth, email, password
        );

        await setDoc(doc(db, 'userProfiles', credential.user.uid), {
          name: name.trim(),
          email,
          role,
          status: 'pending',
          studentNis: role === 'parent' ? studentNis.trim() : '',
          verificationCode: role === 'parent' ? verificationCode.trim() : '',
          createdAt: serverTimestamp(),
        });

        setError('Pendaftaran berhasil. Akun menunggu verifikasi Admin.');
        setMode('login');
        return;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Terjadi kesalahan.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-5">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-7 shadow-sm space-y-5"
      >
        <div className="text-center">
          <div className="text-3xl mb-2">🎓</div>
          <h1 className="text-2xl font-bold text-[#0F294A]">
            SMP Taman Siswa
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Portal Kemitraan Akademik
          </p>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => setMode('login')}
            className={`flex-1 rounded-lg p-2 text-sm ${mode === 'login' ? 'bg-[#0F294A] text-white' : 'bg-slate-100'}`}>
            Masuk
          </button>
          <button type="button" onClick={() => setMode('register')}
            className={`flex-1 rounded-lg p-2 text-sm ${mode === 'register' ? 'bg-[#0F294A] text-white' : 'bg-slate-100'}`}>
            Daftar
          </button>
        </div>

        {mode === 'register' && (
          <>
            <label className="block text-sm">
              Nama lengkap
              <input required value={name} onChange={e => setName(e.target.value)}
                className="mt-1 w-full border rounded-lg p-3" />
            </label>

            <label className="block text-sm">
              Daftar sebagai
              <select value={role} onChange={e => setRole(e.target.value as Role)}
                className="mt-1 w-full border rounded-lg p-3">
                <option value="parent">Orang tua / Wali Murid</option>
                <option value="educator">Guru / Pendidik</option>
              </select>
            </label>

            {role === 'parent' && (
              <>
                <label className="block text-sm">
                  NIS siswa (opsional)
                  <input value={studentNis} onChange={e => setStudentNis(e.target.value)}
                    className="mt-1 w-full border rounded-lg p-3" />
                </label>
                <label className="block text-sm">
                  Kode verifikasi sekolah (opsional)
                  <input value={verificationCode} onChange={e => setVerificationCode(e.target.value)}
                    className="mt-1 w-full border rounded-lg p-3" />
                </label>
              </>
            )}
          </>
        )}

        <label className="block text-sm">
          Email
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="mt-1 w-full border rounded-lg p-3" />
        </label>

        <label className="block text-sm">
          Password
          <input required type="password" minLength={6} value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 w-full border rounded-lg p-3" />
        </label>

        {error && <p className="text-sm text-blue-700">{error}</p>}

        <button disabled={loading} type="submit"
          className="w-full rounded-lg bg-[#2563EB] text-white font-semibold p-3 disabled:opacity-50">
          {loading ? 'Memproses...' : mode === 'login' ? 'Masuk ke Portal' : 'Buat Akun'}
        </button>
      </form>
    </main>
  );
}
