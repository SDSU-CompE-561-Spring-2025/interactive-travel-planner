// /app/planner/[step]/page.tsx
'use client'; 

import { useRouter, useParams } from 'next/navigation';
import StartStep from '@/components/planner/StartStep';
import NameStep from '@/components/planner/NameStep';
import ActivitiesStep from '@/components/planner/ActivitiesStep';
import BudgetStep from '@/components/planner/BudgetStep';
import LocationStep from '@/components/planner/LocationStep';
import DatesStep from '@/components/planner/DatesStep';
import ReviewStep from '@/components/planner/ReviewStep'; 

export default function PlannerStepPage() {
  const params = useParams();
  const step = params.step as string;

  const steps: Record<string, React.ReactNode> = {
    start: <StartStep />,
    name: <NameStep />,
    activities: <ActivitiesStep />,
    budget: <BudgetStep />,
    location: <LocationStep />,
    dates: <DatesStep />,
    review: <ReviewStep />,
  };

  return (
    <div>
      {steps[step] || <div>Step not found</div>}
    </div>
  );
}
