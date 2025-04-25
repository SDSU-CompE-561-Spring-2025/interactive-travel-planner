"use client"

import { useState } from "react";

export default function PlannerPage() {
    const [count, setCount] = useState(0);
    return (
        <div>
            <h1>Planner Page</h1>
            <h1>Count: {count}</h1>
            <button type="button" className="border-8 border-blue-80 hover:" onClick={() => setCount(count + 1)}>Increment</button>

        </div>
    );
}