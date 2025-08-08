import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <a href="#home" className="font-semibold text-lg tracking-tight inline-flex items-center gap-2" aria-label="Limejuic home">
          <svg
            className="size-6 text-brand"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Lime fruit logo"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="2" />
            <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="5.64" y1="5.64" x2="18.36" y2="18.36" stroke="currentColor" strokeWidth="2" />
            <line x1="18.36" y1="5.64" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="text-gradient-brand">Limejuic</span>
        </a>
        <nav aria-label="Primary" className="hidden gap-8 md:flex text-sm">
          <a href="#home" className="hover:text-foreground/80">Home</a>
          <a href="#services" className="hover:text-foreground/80">Services</a>
          <a href="#projects" className="hover:text-foreground/80">Projects</a>
          <a href="#contact" className="hover:text-foreground/80">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="hidden md:inline-flex">
            <a href="#contact" aria-label="Start a project">Start a Project</a>
          </Button>
          <Button asChild variant="brand">
            <a href="#contact" aria-label="Let's Talk">Let's Talk</a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;