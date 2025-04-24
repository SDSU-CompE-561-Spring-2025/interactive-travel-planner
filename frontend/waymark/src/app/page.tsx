import Title from "@/components/Title";
import { Plane, ClipboardList } from "lucide-react";

export default function Home() {
  return (
    <main>
      <Title
        title="Welcome to Waymark"
        subtitle="Your Interactive Travel Planner"
      />
      <div className ="flex justify-center">
        <Plane/>
        <ClipboardList/>
      </div>
    </main>

  );
}
