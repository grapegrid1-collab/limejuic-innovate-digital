const Footer = () => {
  return (
    <footer className="border-t mt-20">
      <div className="container py-10 grid gap-4 md:grid-cols-2 items-center">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Limejuic. All rights reserved.</p>
        <div className="md:text-right text-sm">
          <a href="mailto:contact@limejuic.com" className="hover:underline">contact@limejuic.com</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;