import { useRouter } from 'next/router';



export default function PlannerStep() {
  const router = useRouter();
  const { step } = router.query;

  return (
    <div className="p-8">
      {step === 'start' && <StartStep />}
      {step === 'name' && <NameStep />}
      {step === 'activities' && <ActivitiesStep />}
      {step === 'budget' && <BudgetStep />}
      {step === 'locations' && <LocationStep />}
      {step === 'dates' && <DatesStep />}
      {step === 'review' && <ReviewStep />}
    </div>
  );
}
