import type { ReactNode } from 'react';
import { CalendarCheck2, Check, ShieldCheck, Sparkles } from 'lucide-react';
import logo from '@/assets/logo.png';
import { ModeToggle } from '@/components/common/ModeToggle';

interface AuthLayoutProps {
  children: ReactNode;
  eyebrow?: string;
}

export function AuthLayout({ children, eyebrow = 'Welcome to SHN' }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(28rem,0.95fr)]">
        <section className="relative hidden overflow-hidden border-r border-border bg-muted/40 p-10 lg:flex lg:flex-col xl:p-14">
          <div className="absolute -left-24 top-1/3 size-72 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -right-20 bottom-12 size-64 rounded-full bg-secondary/10 blur-3xl" aria-hidden="true" />

          <div className="relative flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
              <img src={logo} alt="SHN" className="h-7 w-auto" />
            </div>
            <div>
              <p className="font-semibold tracking-tight">SHN</p>
              <p className="text-xs text-muted-foreground">Salon & service management</p>
            </div>
          </div>

          <div className="relative my-auto max-w-xl py-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
              Built for modern service teams
            </div>
            <h1 className="max-w-lg text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Run your business with clarity and confidence.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
              Keep appointments, customers, staff, and daily operations together in one calm workspace.
            </p>

            <div className="mt-10 grid max-w-lg gap-3 sm:grid-cols-2">
              {[
                [CalendarCheck2, 'Effortless scheduling'],
                [ShieldCheck, 'Secure by design'],
              ].map(([Icon, label]) => (
                <div key={label as string} className="flex items-center gap-3 rounded-xl border border-border bg-card/80 p-4 shadow-sm">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium">{label as string}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="size-3.5 text-primary" aria-hidden="true" />
            Trusted tools for focused teams
          </p>
        </section>

        <section className="relative flex min-h-screen items-center justify-center px-5 py-20 sm:px-8 lg:px-12">
          <div className="absolute right-5 top-5 sm:right-8 sm:top-7">
            <ModeToggle />
          </div>
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
                <img src={logo} alt="SHN" className="h-6 w-auto" />
              </div>
              <div>
                <p className="font-semibold tracking-tight">SHN</p>
                <p className="text-xs text-muted-foreground">Salon & service management</p>
              </div>
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
