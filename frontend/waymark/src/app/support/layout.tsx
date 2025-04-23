export default function SupportLayout({
    children,
    }: Readonly<{
    children: React.ReactNode;
    }>) {
    return (
        <div className="flex flex-col items-center justify-center">
        <h1>Support Layout</h1>
        {children}
        </div>
    );
    }
