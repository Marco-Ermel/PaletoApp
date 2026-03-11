import Link from "next/link";
import { Building2, CheckCircle, Users, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PaletoApp</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Anmelden
              </Link>
              <Button asChild>
                <Link href="/register">Kostenlos starten</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Bau-Management
            <span className="text-blue-600"> vereinfacht</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Verwalten Sie Ihr Bauunternehmen professionell. Mitarbeiter, Projekte,
            Zeiterfassung und Finanzen – alles an einem Ort.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">Kostenlos starten</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Anmelden</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Alles was Sie brauchen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Teamverwaltung",
                description: "Verwalten Sie Ihre Mitarbeiter mit Rollen und Berechtigungen.",
              },
              {
                icon: Shield,
                title: "Mandantensicher",
                description: "Ihre Daten sind sicher. Jedes Unternehmen sieht nur seine eigenen Daten.",
              },
              {
                icon: TrendingUp,
                title: "Skalierbar",
                description: "Wächst mit Ihrem Unternehmen. Von 3 bis 100+ Mitarbeiter.",
              },
              {
                icon: CheckCircle,
                title: "Professionell",
                description: "Entwickelt für Schweizer Bauunternehmen.",
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="flex justify-center mb-4">
                  <feature.icon className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} PaletoApp. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
