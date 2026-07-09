"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OS, OS_HINTS, OS_LABELS, SETUP_STEPS } from "@/lib/setup-steps";
import CopyButton from "@/components/CopyButton";

const OS_KEY = "navi-os";
const doneKey = (os: OS) => `navi-done-${os}`;

export default function SetupWizard() {
  const [os, setOs] = useState<OS | null>(null);
  const [done, setDone] = useState<boolean[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedOs = localStorage.getItem(OS_KEY) as OS | null;
    if (savedOs && SETUP_STEPS[savedOs]) {
      setOs(savedOs);
      setDone(loadDone(savedOs));
    }
    setLoaded(true);
  }, []);

  function loadDone(target: OS): boolean[] {
    try {
      const raw = localStorage.getItem(doneKey(target));
      const parsed = raw ? (JSON.parse(raw) as boolean[]) : [];
      return SETUP_STEPS[target].map((_, i) => parsed[i] ?? false);
    } catch {
      return SETUP_STEPS[target].map(() => false);
    }
  }

  function selectOs(target: OS) {
    setOs(target);
    setDone(loadDone(target));
    localStorage.setItem(OS_KEY, target);
  }

  function toggle(index: number) {
    if (!os) return;
    const next = done.map((d, i) => (i === index ? !d : d));
    setDone(next);
    localStorage.setItem(doneKey(os), JSON.stringify(next));
  }

  if (!loaded) return null;

  const steps = os ? SETUP_STEPS[os] : [];
  const doneCount = done.filter(Boolean).length;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold text-stone-500 dark:text-stone-400">
          お使いのPCを選んでください
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(OS_LABELS) as OS[]).map((key) => (
            <button
              key={key}
              onClick={() => selectOs(key)}
              className={`rounded-xl border p-4 text-left transition ${
                os === key
                  ? "border-crail bg-clay-50 dark:border-coral dark:bg-clay-900"
                  : "border-stone-200 bg-white hover:border-stone-400 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-600"
              }`}
            >
              <div className="font-bold">{OS_LABELS[key]}</div>
              <div className="mt-1 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                {OS_HINTS[key]}
              </div>
            </button>
          ))}
        </div>
      </section>

      {os && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-500 dark:text-stone-400">
              {OS_LABELS[os]} のセットアップ手順
            </h2>
            <span className="text-sm text-stone-500 dark:text-stone-400">
              {doneCount} / {steps.length} 完了
            </span>
          </div>
          <div className="mb-6 h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
            <div
              className="h-full rounded-full bg-crail transition-all dark:bg-coral"
              style={{ width: `${(doneCount / steps.length) * 100}%` }}
            />
          </div>

          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li
                key={i}
                className={`rounded-xl border p-5 transition ${
                  done[i]
                    ? "border-stone-200 bg-stone-100/60 opacity-60 dark:border-stone-800 dark:bg-stone-900/40"
                    : "border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
                }`}
              >
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={done[i]}
                    onChange={() => toggle(i)}
                    className="mt-1 size-5 shrink-0 accent-crail dark:accent-coral"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold">
                      <span className="mr-2 text-crail dark:text-coral">
                        Step {i + 1}
                      </span>
                      {step.title}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                      {step.description}
                    </p>
                  </div>
                </label>

                {step.command && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#1d1a17] p-3 dark:bg-black">
                    <pre className="min-w-0 flex-1 overflow-x-auto font-mono text-xs leading-relaxed text-stone-100">
                      {step.command}
                    </pre>
                    <CopyButton text={step.command} />
                  </div>
                )}
                {step.expected && (
                  <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">
                    ✅ {step.expected}
                  </p>
                )}
                {step.note && (
                  <p className="mt-2 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                    💡 {step.note}
                  </p>
                )}
              </li>
            ))}
          </ol>

          {doneCount === steps.length && (
            <div className="mt-6 rounded-xl border border-emerald-300 bg-emerald-50 p-5 text-center dark:border-emerald-800 dark:bg-emerald-950/40">
              <div className="text-lg font-bold">🎉 セットアップ完了!</div>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                <Link href="/skills/" className="text-crail underline underline-offset-4 dark:text-coral">
                  スキル一覧
                </Link>
                で、それぞれのスキルの使い方を見てみましょう。
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
