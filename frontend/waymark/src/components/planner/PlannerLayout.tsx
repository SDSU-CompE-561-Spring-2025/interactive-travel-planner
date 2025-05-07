import type { ReactNode } from 'react';
import { ProgressSteps } from '../ui/progress-step';

interface PlannerLayoutProps {
  children: ReactNode;
  currentStep: number;
}

const steps = [
  'Start',
  'Name',
  'Dates',
  'Location',
  'Activities',
  'Budget',
  'Collaborators',
  'Review',
];

export default function PlannerLayout({ children, currentStep }: PlannerLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gray-50 px-4 py-12">
      {/* Progress bar */}
      <div className="w-full max-w-4xl mb-8">
        <ProgressSteps steps={steps} currentStep={currentStep} />
      </div>

      {/* Content card */}
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-md border border-gray-200">
        {children}
      </div>
    </main>
  );
}
