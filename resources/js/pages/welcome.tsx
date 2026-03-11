import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CertificateResult } from '@/types/CertificateResult';

const UID_REGEX = /^SDC-[A-Z]{2,5}-\d{4}-\d{4}-[A-Z]-\d+$/;

interface Course {
  id: number;
  name: string;
}

interface MyPageProps extends Record<string, unknown> {
  status: boolean | null;
  message: string | null;
  data: CertificateResult | null;
}

interface PageProps extends Record<string, unknown> {
  auth: { user: unknown };
  name: string;
}

function isCourse(value: unknown): value is Course {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value
  );
}

export default function Welcome({ app_name }: { app_name: string }) {
  const { data, setData, post, processing, errors, reset } =
    useForm<{ uid: string }>({
      uid: '',
    });

  const normalizedUid = useMemo(
    () => data.uid.trim().toUpperCase(),
    [data.uid]
  );

  const isValidUid = UID_REGEX.test(normalizedUid);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidUid || processing) return;

    post('/certificate', {
      preserveScroll: true,
      onSuccess: () => reset('uid'),
    });
  }

  const { props } = usePage<MyPageProps>();
  const { status, message, data: info } = props;

  const { auth, name } = usePage<PageProps>().props;

  const isLoggedIn = !!auth.user;

  return (
    <>
      <Head title="Verify Certificate" />

      {/* Header */}
      <header className="border-b bg-white dark:bg-[#0f0f0f]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h2 className="text-lg font-semibold">
            {name}
          </h2>

        {isLoggedIn ? (
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>)}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-screen items-center justify-center bg-[#FDFDFC] p-6 dark:bg-[#0a0a0a]">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl dark:bg-[#0f0f0f]">
          <h1 className="mb-6 text-center text-2xl font-semibold">
            Verify Your Certificate
          </h1>

          <form onSubmit={submit} className="space-y-4">
            <Input
              value={data.uid}
              onChange={(e) => setData('uid', e.target.value)}
              placeholder="SDC-DGM-2506-0001-M-12"
              autoComplete="off"
              spellCheck={false}
              required
            />

            {!isValidUid && data.uid.length > 0 && (
              <p className="text-sm text-red-500">
                Invalid certificate format
              </p>
            )}

            {errors.uid && (
              <p className="text-sm text-red-500">{errors.uid}</p>
            )}

            <Button
              type="submit"
              disabled={!isValidUid || processing}
              className="w-full"
            >
              {processing ? 'Verifying…' : 'Verify Certificate'}
            </Button>
          </form>

          {status === true && info && (
            <div className="mt-6 overflow-hidden rounded-lg border">
              <div className="bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                ✅ Certificate is valid
              </div>

              <table className="w-full text-sm">
                <tbody className="divide-y">
                  {Object.entries(info).map(([key, value]) => {
                    let displayValue: React.ReactNode = '—';

                    if (key === 'courses' && value) {
                      if (Array.isArray(value)) {
                        displayValue = value
                          .filter(isCourse)
                          .map(course => course.name)
                          .join(', ');
                      } else if (isCourse(value)) {
                        displayValue = value.name;
                      }
                    } else if (
                      typeof value === 'string' ||
                      typeof value === 'number'
                    ) {
                      displayValue = value;
                    }

                    return (
                      <tr key={key}>
                        <td className="px-4 py-2 font-medium">
                          {key
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, c =>
                              c.toUpperCase()
                            )}
                        </td>
                        <td className="px-4 py-2">
                          {displayValue}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {status === false && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              ❌ {message}
            </div>
          )}
        </div>
      </main>
    </>
  );
}