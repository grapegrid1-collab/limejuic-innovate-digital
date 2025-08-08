import { useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import heroImage from "@/assets/hero-limejuic.jpg";
import { Bot, Code2, Rocket, Smartphone, Sparkles, Palette } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Tell us a bit more about your project")
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ServiceCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <Card className="h-full border-foreground/10">
    <CardHeader>
      <CardTitle className="flex items-center gap-3">
        <span className="text-brand">{icon}</span>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </CardContent>
  </Card>
);

const ContactForm = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: values.name,
        email: values.email,
        message: values.message,
      });
      if (error) throw error;
      toast.success("Thanks! Your message was received.");
      reset();
      // We will also send a confirmation email once email service is configured.
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Could not submit. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm">Name</label>
        <Input id="name" placeholder="Your name" {...register("name")} aria-invalid={!!errors.name} />
        {errors.name && <span className="text-sm text-destructive">{errors.name.message}</span>}
      </div>
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm">Email</label>
        <Input id="email" type="email" placeholder="you@company.com" {...register("email")} aria-invalid={!!errors.email} />
        {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
      </div>
      <div className="grid gap-2">
        <label htmlFor="message" className="text-sm">Describe your project</label>
        <Textarea id="message" placeholder="Tell us about timelines, goals, and scope…" rows={6} {...register("message")} aria-invalid={!!errors.message} />
        {errors.message && <span className="text-sm text-destructive">{errors.message.message}</span>}
      </div>
      <div className="pt-2">
        <Button type="submit" variant="hero" className="w-full md:w-auto" disabled={isSubmitting}>
          Let’s Build It
        </Button>
      </div>
    </form>
  );
};

const Index = () => {
  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Limejuic",
    "url": "https://limejuic.com/",
    "logo": "https://limejuic.com/logo.png",
    "sameAs": [],
    "email": "contact@limejuic.com",
    "description": "Limejuic is a web development and AI solutions agency crafting fast, scalable digital experiences.",
    "contactPoint": [{
      "@type": "ContactPoint",
      "email": "contact@limejuic.com",
      "contactType": "sales"
    }]
  }), []);

  return (
    <>
      <Header />
      <main id="home" className="">
        {/* Hero */}
        <section className="container pt-16 md:pt-24 lg:pt-28">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="size-4 text-brand" />
                Squeeze More Out of Innovation
              </p>
              <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient-brand">Web & AI solutions</span> that look stunning and scale beautifully
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-prose">
                From SaaS platforms to AIaaS automation, we design and build next-gen digital products — websites, mobile apps, and cloud solutions — fast, scalable, and crafted with precision.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button asChild variant="hero">
                  <a href="#contact" aria-label="Start a conversation">Let’s Talk</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="#services" aria-label="View our services">View Services</a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Limejuic hero — abstract lime and teal gradient with futuristic tech motifs"
                loading="lazy"
                className="w-full rounded-lg shadow-brand-glow"
              />
              <div aria-hidden className="pointer-events-none absolute -inset-10 -z-10 blur-3xl opacity-40">
                <div className="bg-gradient-brand w-full h-full rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="container mt-20 md:mt-28">
          <h2 className="text-2xl md:text-3xl font-semibold">Our Specialties</h2>
          <p className="mt-2 text-muted-foreground">Bold design. Robust development. Smart automation.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ServiceCard icon={<Bot />} title="AI-driven tools & automation" desc="Integrate intelligent agents, workflows, and data pipelines that save time and unlock new capabilities." />
            <ServiceCard icon={<Code2 />} title="Web development" desc="Modern, fast, and responsive websites using best-in-class frameworks and patterns." />
            <ServiceCard icon={<Smartphone />} title="Custom mobile apps" desc="Native-feeling iOS & Android apps with scalable APIs and delightful UX." />
            <ServiceCard icon={<Palette />} title="Seamless UX/UI design" desc="Design systems, prototypes, and polished interfaces that convert and retain." />
            <ServiceCard icon={<Rocket />} title="Launch & growth" desc="From MVP to production — we optimize performance, SEO, and analytics." />
            <ServiceCard icon={<Sparkles />} title="Automation & integrations" desc="Connect your stack and automate the boring — from CRMs to internal tools." />
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="container mt-20 md:mt-28">
          <h2 className="text-2xl md:text-3xl font-semibold">Selected Projects</h2>
          <p className="mt-2 text-muted-foreground">A glimpse of what we craft — fast, scalable, and beautiful.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { title: "AI Support Copilot", desc: "Automated triage + assisted responses reducing handle time by 42%." },
              { title: "Headless Commerce", desc: "Lightning-fast storefront with seamless checkout and analytics." },
              { title: "SaaS Admin Suite", desc: "Clean dashboards, role-based access, and real-time insights." }
            ].map((p) => (
              <Card key={p.title} className="h-full border-foreground/10">
                <CardHeader>
                  <CardTitle>{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="container mt-20 md:mt-28">
          <h2 className="text-2xl md:text-3xl font-semibold">Frequently Asked Questions</h2>
          <p className="mt-2 text-muted-foreground">Quick answers about our process, timelines, and pricing approach.</p>
          <div className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>What services does Limejuic offer?</AccordionTrigger>
                <AccordionContent>
                  We design and build modern websites, SaaS platforms, mobile apps, and AI automations — from idea to launch.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>How long does a typical project take?</AccordionTrigger>
                <AccordionContent>
                  Most projects take 2–8 weeks depending on scope. MVPs can be shipped faster using our streamlined process.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>How do you price projects?</AccordionTrigger>
                <AccordionContent>
                  We offer fixed-price packages for clarity, plus flexible retainers for ongoing work. After a short discovery, we’ll propose the best fit.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger>Do you handle hosting and maintenance?</AccordionTrigger>
                <AccordionContent>
                  Yes — we set up scalable hosting, analytics, and monitoring. We also offer maintenance plans for updates and improvements.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="container mt-20 md:mt-28">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold">Let’s Create Together</h2>
              <p className="mt-2 text-muted-foreground max-w-prose">
                Have a project in mind? Tell us about it and we’ll get back to you shortly.
              </p>
              <div className="mt-6">
                <a className="text-sm hover:underline" href="mailto:contact@limejuic.com">contact@limejuic.com</a>
              </div>
            </div>
            <Card>
              <CardContent className="pt-6">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What services does Limejuic offer?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We design and build modern websites, SaaS platforms, mobile apps, and AI automations — from idea to launch."
                }
              },
              {
                "@type": "Question",
                name: "How long does a typical project take?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Most projects take 2–8 weeks depending on scope. MVPs can be shipped faster using our streamlined process."
                }
              },
              {
                "@type": "Question",
                name: "How do you price projects?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We offer fixed-price packages for clarity, plus flexible retainers for ongoing work. After a short discovery, we’ll propose the best fit."
                }
              },
              {
                "@type": "Question",
                name: "Do you handle hosting and maintenance?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes — we set up scalable hosting, analytics, and monitoring. We also offer maintenance plans for updates and improvements."
                }
              }
            ]
          })
        }}
      />
    </>
  );
};

export default Index;
