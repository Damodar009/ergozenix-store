"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-screen-2xl py-8 px-4">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your application preferences</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Theme Settings</CardTitle>
                  <CardDescription>Choose your preferred theme</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {(["light", "dark", "system"] as const).map((t) => (
                      <label key={t} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          value={t}
                          checked={theme === t}
                          onChange={() => setTheme(t)}
                          className="h-4 w-4"
                        />
                        <span className="capitalize font-medium">{t} Mode</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full mt-1 px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full mt-1 px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                    />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
