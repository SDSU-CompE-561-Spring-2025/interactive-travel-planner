import Title from "@/components/Title";

export default function BudgetPage() {
    return (
        <div>
            <Title 
                title="Step 4:"
                subtitle="What is your budget?"
            />
            <input className="input_number"type="number" />
            
        </div>
    );
}