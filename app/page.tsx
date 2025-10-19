import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-screen-2xl py-8 px-4">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome Home</h1>
                <p className="text-muted-foreground mt-2">This is a modern app with dark mode and theme support</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Feature One</CardTitle>
                    <CardDescription>Explore the first feature</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">This card demonstrates the theme system in action.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Feature Two</CardTitle>
                    <CardDescription>Explore the second feature</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Dark mode is fully supported throughout the app.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Feature Three</CardTitle>
                    <CardDescription>Explore the third feature</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Toggle the theme using the button in the header.</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>Learn how to use this project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Project Structure</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>
                        <code className="bg-muted px-2 py-1 rounded">services/</code> - Business logic and API calls
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded">models/</code> - TypeScript interfaces and types
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded">components/</code> - Reusable React components
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded">app/</code> - Next.js pages and routes
                      </li>
                    </ul>
                  </div>
                  <Button>Learn More</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
