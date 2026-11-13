import type { ReactNode } from 'react';

export type StepState = 'done' | 'current' | 'upcoming';

type Props = {
    number: number;
    title: string;
    state: StepState;
    summary?: ReactNode;   // one line shown once the step is done
    onEdit?: () => void;
    children?: ReactNode;  // the step's form, shown only while it is current
};

// One section of the checkout. Done steps fold into a one-line summary,
// the current step is open, upcoming steps show only their title.
export default function CheckoutStep({ number, title, state, summary, onEdit, children }: Props) {
    return (
        <section
            aria-current={state === 'current' ? 'step' : undefined}
            className={`rounded-xl border bg-white/60 ${state === 'current' ? 'border-ink' : 'border-line'}`}
        >
            <div className="flex items-start gap-4 p-4 sm:p-5">
                <span
                    className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                        state === 'current'
                            ? 'bg-ink text-paper'
                            : state === 'done'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-line text-muted'
                    }`}
                >
                    {state === 'done' ? '✓' : number}
                </span>

                <div className="min-w-0 flex-1 pt-1">
                    <h2 className={`font-medium ${state === 'upcoming' ? 'text-muted' : ''}`}>{title}</h2>
                    {state === 'done' && summary && <div className="mt-1 text-sm text-muted">{summary}</div>}
                </div>

                {state === 'done' && onEdit && (
                    <button type="button" onClick={onEdit} className="pt-1 text-sm font-medium text-accent hover:underline">
                        Modifică
                    </button>
                )}
            </div>

            {state === 'current' && <div className="px-4 pb-5 sm:px-5 sm:pl-17">{children}</div>}
        </section>
    );
}