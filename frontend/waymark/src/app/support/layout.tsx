export default function SupportLayout({
    children,
    }: Readonly<{
    children: React.ReactNode;
    }>) {
    return (
<<<<<<< HEAD
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-3xl font-bold">Support</h1>
            {children}
=======
        <div className="flex flex-col items-center justify-center">
        <h1>Support Layout</h1>
        {children}
>>>>>>> de9de4dcb11a155e8bc670f933e89fcd51970597
        </div>
    );
    }
