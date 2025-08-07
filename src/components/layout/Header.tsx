import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <a href="#home" className="font-semibold text-lg tracking-tight">
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