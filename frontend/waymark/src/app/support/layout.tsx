export default function SupportLayout({
    children,
    }: Readonly<{
    children: React.ReactNode;
    }>) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold">Support</h1>
        {children}
        </div>
    );
    }
