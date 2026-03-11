import { requireUser } from "@/lib/auth/guards";
import { PLAN_CONFIGS } from "@/lib/plans";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import type { PlanType } from "@prisma/client";

export default async function SubscriptionPage() {
  const user = await requireUser();
  const subscription = user.organization.subscription;
  const currentPlan = subscription?.plan.type as PlanType | undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Abonnement</h1>
        <p className="text-gray-600">Verwalten Sie Ihr Abonnement und Ihre Plan-Limits.</p>
      </div>

      {currentPlan && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-600">Aktueller Plan</Badge>
              <span className="font-semibold text-lg">
                {PLAN_CONFIGS[currentPlan].name}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Max. Mitarbeiter:</span>{" "}
                {PLAN_CONFIGS[currentPlan].maxEmployees}
              </div>
              <div>
                <span className="font-medium">Max. Projekte:</span>{" "}
                {PLAN_CONFIGS[currentPlan].maxProjects}
              </div>
              <div>
                <span className="font-medium">Max. Einladungen:</span>{" "}
                {PLAN_CONFIGS[currentPlan].maxInvitations}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Object.values(PLAN_CONFIGS).map((plan) => (
          <Card
            key={plan.type}
            className={plan.type === currentPlan ? "border-blue-500 ring-2 ring-blue-500" : ""}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.type === currentPlan && (
                  <Badge variant="secondary">Aktuell</Badge>
                )}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-3xl font-bold">CHF {plan.priceMonthly}</span>
                <span className="text-gray-500">/Monat</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
