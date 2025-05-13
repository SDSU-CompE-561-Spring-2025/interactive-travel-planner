export default function ColorPreview() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Color Scheme Preview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Base Colors</h2>
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-md bg-[#fff8f0] border"></div>
              <div>
                <p className="font-medium">Background</p>
                <p className="text-sm text-muted-foreground">#fff8f0</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-md bg-[#f3a034]"></div>
              <div>
                <p className="font-medium">Primary</p>
                <p className="text-sm text-muted-foreground">#f3a034</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-md bg-[#4ba46c]"></div>
              <div>
                <p className="font-medium">Secondary</p>
                <p className="text-sm text-muted-foreground">#4ba46c</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-md bg-[#377c68]"></div>
              <div>
                <p className="font-medium">Accent</p>
                <p className="text-sm text-muted-foreground">#377c68</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">UI Elements</h2>
          <div className="space-y-4">
            <button className="bg-primary text-white px-4 py-2 rounded-md">Primary Button</button>
            <button className="bg-secondary text-white px-4 py-2 rounded-md ml-2">Secondary Button</button>
            <button className="bg-accent text-white px-4 py-2 rounded-md ml-2">Accent Button</button>

            <div className="mt-4">
              <div className="h-2 w-full bg-muted rounded-full">
                <div className="h-2 w-2/3 bg-primary rounded-full"></div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Progress Bar</p>
            </div>

            <div className="flex gap-2 mt-4">
              <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-primary">
                Primary Badge
              </span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-secondary">
                Secondary Badge
              </span>
            </div>

            <div className="p-4 border rounded-md bg-background mt-4">
              <p className="font-medium">Card with Background Color</p>
              <p className="text-sm text-muted-foreground">This shows the background color in a card.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
        <div className="grid grid-cols-5 gap-2">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
            <div key={`orange-${shade}`} className="space-y-1">
              <div className={`h-10 rounded-md bg-orange-${shade}`}></div>
              <p className="text-xs text-center">{shade}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2 mt-4">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
            <div key={`green-${shade}`} className="space-y-1">
              <div className={`h-10 rounded-md bg-green-${shade}`}></div>
              <p className="text-xs text-center">{shade}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
