'use client'; 

import { useRouter, useParams } from 'next/navigation';
import StartStep from '@/components/planner/StartStep';
import NameStep from '@/components/planner/NameStep';
import ActivitiesStep from '@/components/planner/ActivitiesStep';
import BudgetStep from '@/components/planner/BudgetStep';
import DestinationStep from '@/components/planner/DestinationStep';
import DatesStep from '@/components/planner/DatesStep';
import ReviewStep from '@/components/planner/ReviewStep'; 
import CollaboratorsStep from '@/components/planner/CollaboratorsStep';

export default function PlannerStepPage() {
  const params = useParams();
  const step = params.step as string;

  const steps: Record<string, React.ReactNode> = {
    start: <StartStep />,
    name: <NameStep />,
    dates: <DatesStep />,
    destination: <DestinationStep />,
    //activities: <ActivitiesStep />,
    budget: <BudgetStep />,
    collab: <CollaboratorsStep />,
    review: <ReviewStep />,
  };

  return (
    <div>
      {steps[step] || <div>Step not found</div>}
    </div>
  );
}
