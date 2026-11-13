
import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';

type Mode = 'login' | 'register';
type Role = 'parent' | 'educator';

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [role, setRole] = useState<Role>('parent');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentNis, setStudentNis] = useState('');
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
        if (!name.trim()) {
          throw new Error('Nama wajib diisi.');
        }

        if (password.length < 6) {
          throw new Error('Password minimal 6 karakter.');
        }

        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        await setDoc(
          doc(db, 'userProfiles', credential.user.uid),
          {
            name: name.trim(),
            email: email.trim(),
            role,
            status: 'pending',
            studentNis: role === 'parent' ? studentNis.trim() : '',
            createdAt: serverTimestamp(),
          }
        );
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
          <h1 className="text-2xl font-bold text-slate-800">
            SMP Taman Siswa
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Portal Informasi Akademik Sekolah
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 rounded-lg p-2 ${
              mode === 'login'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            Masuk
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 rounded-lg p-2 ${
              mode === 'register'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            Daftar
          </button>
        </div>

        {mode === 'register' && (
          <>
            <div>
              <label className="block text-sm mb-1">Nama lengkap</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg p-3"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Daftar sebagai</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full border rounded-lg p-3"
              >
                <option value="parent">Orang Tua / Wali</option>
                <option value="educator">Guru / Pendidik</option>
              </select>
            </div>

            {role === 'parent' && (
              <div>
                <label className="block text-sm mb-1">
                  NIS Siswa
                </label>
                <input
                  value={studentNis}
                  onChange={(e) => setStudentNis(e.target.value)}
                  className="w-full border rounded-lg p-3"
                  placeholder="Masukkan NIS anak"
                />
              </div>
            )}
          </>
        )}

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="nama@email.com"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="Minimal 6 karakter"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 text-white p-3 disabled:opacity-50"
        >
          {loading
            ? 'Memproses...'
            : mode === 'login'
              ? 'Masuk'
              : 'Daftar Akun'}
        </button>

        {mode === 'register' && (
          <p className="text-xs text-slate-500 text-center">
            Akun baru akan menunggu persetujuan Admin sekolah.
          </p>
        )}
      </form>
    </main>
  );
}
