import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Users, BarChart3, Calendar, Star } from 'lucide-react';

export default function Welcome({
  canRegister = true,
}: {
  canRegister?: boolean;
}) {
  const { auth } = usePage<SharedData>().props;

  return (
    <>
      <Head title="Home Page">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
          rel="stylesheet"
        />
      </Head>
      <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
        <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
          <nav className="flex items-center justify-end gap-4">
            {auth.user ? (
              <Link
                href={dashboard()}
                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href={login()}
                  className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                >
                  Log in
                </Link>
                {canRegister && (
                  <Link
                    href={register()}
                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                  >
                    Register
                  </Link>
                )}
              </>
            )}
          </nav>
        </header>
        <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
          <main className="flex w-full items-center justify-center">

            <div className="relative z-10 w-full max-w-md border-2 rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur dark:bg-[#0f0f0f]/90">
              <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Verify Your Certificate
              </h1>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter Certificate ID"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-700 dark:bg-[#111] dark:text-gray-100"
                />
                <Button className="w-full">
                  Find Now
                </Button>
              </div>
            </div>
          </main>
        </div>
        <div className="hidden h-14.5 lg:block"></div>
      </div>
    </>
  );
}
