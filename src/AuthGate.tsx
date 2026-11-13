
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import LoginScreen from './components/auth/LoginScreen';
import App from './App';

export default function AuthGate() {
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setStatus('login');
        return;
      }

      try {
        const profile = await getDoc(
          doc(db, 'userProfiles', currentUser.uid)
        );

        if (!profile.exists()) {
          setStatus('unregistered');
          return;
        }

        if (profile.data().status !== 'approved') {
          setStatus('pending');
          return;
        }

        setStatus('approved');
      } catch {
        setStatus('error');
      }
    });

    return () => unsubscribe();
  }, []);

  if (status === 'loading') {
    return <div className="p-8 text-center">Memeriksa akun...</div>;
  }

  if (status === 'login') return <LoginScreen />;

  if (status === 'pending') {
    return (
      <div className="p-8 text-center">
        <h2>Akun Menunggu Persetujuan</h2>
        <p>Silakan hubungi Admin sekolah.</p>
        <button onClick={() => signOut(auth)}>Keluar</button>
      </div>
    );
  }

  if (status !== 'approved') {
    return (
      <div className="p-8 text-center">
        <p>Akun belum terdaftar atau terjadi kesalahan.</p>
        <button onClick={() => signOut(auth)}>Keluar</button>
      </div>
    );
  }

  return <App />;
}
