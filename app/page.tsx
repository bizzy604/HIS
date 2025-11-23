"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import {
  Menu,
  X,
  Phone,
  Calendar,
  Clock,
  MapPin,
  HeartPulse,
  Stethoscope,
  Baby,
  Brain,
  Bone,
  Eye,
  Activity,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Star
} from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const departments = [
    { name: "Cardiology", icon: HeartPulse, description: "Comprehensive heart care and surgery" },
    { name: "Neurology", icon: Brain, description: "Advanced treatment for brain disorders" },
    { name: "Pediatrics", icon: Baby, description: "Specialized care for infants and children" },
    { name: "Orthopedics", icon: Bone, description: "Bone, joint, and muscle treatments" },
    { name: "Ophthalmology", icon: Eye, description: "Complete eye care and vision surgery" },
    { name: "General Medicine", icon: Stethoscope, description: "Primary healthcare for all ages" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar - Emergency & Info */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-sm hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="font-semibold">Emergency: 911</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>24/7 Service Available</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:underline">Careers</Link>
            <Link href="#" className="hover:underline">News</Link>
            <Link href="#" className="hover:underline">Patient Portal</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">MediCare<span className="text-primary">Plus</span></span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#departments" className="text-sm font-medium hover:text-primary transition-colors">Departments</Link>
            <Link href="#services" className="text-sm font-medium hover:text-primary transition-colors">Services</Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">About Us</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/appointment">
              <Button size="sm" className="bg-primary hover:bg-primary/90">Book Appointment</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4 space-y-4 animate-in slide-in-from-top-5">
            <nav className="flex flex-col gap-4">
              <Link href="#departments" className="text-sm font-medium p-2 hover:bg-muted rounded-md" onClick={toggleMenu}>Departments</Link>
              <Link href="#services" className="text-sm font-medium p-2 hover:bg-muted rounded-md" onClick={toggleMenu}>Services</Link>
              <Link href="/sign-in" className="text-sm font-medium p-2 hover:bg-muted rounded-md" onClick={toggleMenu}>Sign In</Link>
              <Link href="/appointment" onClick={toggleMenu}>
                <Button className="w-full mt-2">Book Appointment</Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-fade-in-slide-in-from-left">
                <Badge variant="outline" className="px-4 py-1 text-sm border-primary/20 bg-primary/5 text-primary">
                  Leading Healthcare Provider
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                  Your Health Is Our <br />
                  <span className="text-primary">Top Priority</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                  Experience world-class healthcare with our team of expert doctors and state-of-the-art facilities. We are committed to your well-being.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="h-12 px-8 text-base">
                    Find a Doctor
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    Explore Services
                  </Button>
                </div>
                <div className="flex items-center gap-8 pt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Expert Doctors</span>
                  </div>
                </div>
              </div>
              <div className="relative animate-fade-in-slide-in-from-right hidden md:block">
                <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl bg-muted">
                  {/* Placeholder for Hero Image */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent flex items-center justify-center">
                    <div className="text-center p-8">
                      <Activity className="h-24 w-24 text-primary mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground font-medium">Modern Hospital Facility Image</p>
                    </div>
                  </div>
                </div>
                {/* Floating Card */}
                <Card className="absolute -bottom-6 -left-6 w-64 shadow-xl border-primary/10 animate-bounce-slow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">10k+</p>
                      <p className="text-xs text-muted-foreground">Happy Patients</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Years Experience", value: "25+" },
                { label: "Medical Specialists", value: "150+" },
                { label: "Successful Surgeries", value: "12k+" },
                { label: "Hospital Rooms", value: "300+" },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                  <div className="text-sm md:text-base opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Departments Section */}
        <section id="departments" className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Medical Departments</h2>
              <p className="text-lg text-muted-foreground">
                We offer comprehensive medical services across a wide range of specialties, ensuring you receive the best possible care.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept, i) => (
                <Card key={i} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <dept.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{dept.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{dept.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="#" className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
                      Learn more <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden">
              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold">Ready to Prioritize Your Health?</h2>
                <p className="text-lg md:text-xl opacity-90">
                  Book an appointment today and take the first step towards a healthier life. Our team is ready to assist you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold">
                    Book Now
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Contact Us
                  </Button>
                </div>
              </div>
              {/* Decorative circles */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-200 py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl text-white">MediCare<span className="text-primary">Plus</span></span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Providing world-class healthcare services with a focus on patient comfort and safety. Your health is our mission.
              </p>
              <div className="flex gap-4">
                {/* Social Icons Placeholders */}
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  <span className="font-bold">fb</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  <span className="font-bold">tw</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  <span className="font-bold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white text-lg mb-6">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Our Doctors</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Departments</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Appointments</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white text-lg mb-6">Departments</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-primary transition-colors">Cardiology</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Neurology</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Orthopedics</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pediatrics</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Surgery</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white text-lg mb-6">Contact Info</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <span>123 Healthcare Ave, Medical District, NY 10001</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary shrink-0" />
                  <span>info@medicareplus.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} MediCarePlus. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
