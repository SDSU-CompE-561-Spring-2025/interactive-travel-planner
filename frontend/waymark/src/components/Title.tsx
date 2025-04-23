interface TitlePage {
    title: string,
    subtitle: string
}

export default function Title({title, subtitle}: TitlePage) {
    return (
        <div className="p-5 bg-amber-500">
            <h1 className="text-4xl font-bold text-center"> {title || "Welcome to Waymark"} </h1>
            <p className="text-lg text-center"> {subtitle}</p>
        </div>
    );
}
