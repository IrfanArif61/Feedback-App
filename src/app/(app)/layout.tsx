import { NavBar } from "@/components/Navbar";
import { ThemeProvider } from "../_provider";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <NavBar />
        {children}
      </ThemeProvider>
    </div>
  );
}
