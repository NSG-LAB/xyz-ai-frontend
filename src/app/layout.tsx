import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { VoiceModal } from "@/components/ai/VoiceModal";
import { EscalationDialog } from "@/components/dialogs/EscalationDialog";

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "XYZ AI — Human-Like AI School Assistant",
  description: "Next-generation student-first academic companion, voice assistant, timetable, attendance, assignments, and exam prep platform.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <div className="min-h-screen flex flex-col">
          {/* Universal Header */}
          <AppHeader />

          {/* Main Body Area */}
          <div className="flex-1 flex max-w-7xl w-full mx-auto">
            <Sidebar />
            <main className="flex-1 min-w-0 pb-24 lg:pb-10 p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>

          {/* Mobile Bottom Navigation */}
          <MobileNav />

          {/* Global Modals (Voice & Teacher Escalation) */}
          <VoiceModal />
          <EscalationDialog />
        </div>
      </body>
    </html>
  );
}
