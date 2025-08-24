import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, DollarSign, Shield, TrendingUp } from "lucide-react";

const FEATURES = [
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Track Expenses",
    description:
      "Monitor your spending with detailed categorization and insights.",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Financial Goals",
    description:
      "Set and track your financial goals with progress visualization.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Smart Analytics",
    description:
      "Get insights into your spending patterns with interactive charts.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure & Private",
    description: "Your financial data is encrypted and stored securely.",
  },
];

export function FeatureSection() {
  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you understand and improve your
            financial health.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
