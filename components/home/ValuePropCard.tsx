import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ValuePropCardProps {
  icon: string
  title: string
  description: string
}

export function ValuePropCard({ icon, title, description }: ValuePropCardProps) {
  return (
    <Card className="flex flex-col items-center gap-[var(--ef-stack-md)] border-0 shadow-none bg-transparent">
      <CardHeader className="p-0 flex flex-col items-center gap-[var(--ef-stack-md)]">
        <span className="material-symbols-outlined text-primary text-4xl">{icon}</span>
        <CardTitle className="font-label-caps text-label-caps tracking-[0.15em]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 font-body-main text-body-main text-muted-foreground mt-0 text-center">
        {description}
      </CardContent>
    </Card>
  )
}
