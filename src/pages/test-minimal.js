import { useState } from 'react';
import Head from 'next/head';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';

export default function TestMinimal() {
  const { user, loading } = useAuth();

  return (
    <MainLayout title="Test">
      <Head>
        <title>Test Minimal | CBL_alloui</title>
      </Head>

      {/* Simple test section */}
      <section className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8">
            Test Page
          </h1>
          <p className="text-xl">
            If you can see this, the server is working.
          </p>
          {!loading && (
            <div className="mt-8">
              {user ? (
                <p>User logged in: {user.email}</p>
              ) : (
                <p>No user logged in</p>
              )}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}