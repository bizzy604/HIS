"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header/Navigation */}
      <header className="container mx-auto py-6 px-4 sm:px-6 animate-fade-in">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center animate-pulse-slow">
              <span className="text-primary-foreground font-bold text-xl">H</span>
            </div>
            <span className="font-bold text-xl animate-fade-in">Healthcare IS</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-4">
            <ThemeToggle />
            <Link href="/sign-in">
              <Button variant="ghost" className="animate-fade-in">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="animate-fade-in">Sign Up</Button>
            </Link>
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 sm:hidden">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative z-20"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 animate-in zoom-in-50" />
              ) : (
                <Menu className="h-5 w-5 animate-in zoom-in-50" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-10 bg-background/95 backdrop-blur-sm animate-in fade-in-0 duration-200 sm:hidden">
            <div className="container pt-20 px-4 flex flex-col gap-6">
              <div className="flex flex-col gap-4 animate-in slide-in-from-right duration-300">
                <Link href="/sign-in" onClick={toggleMenu}>
                  <Button variant="ghost" className="w-full justify-start text-lg" size="lg">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={toggleMenu}>
                  <Button className="w-full justify-start text-lg" size="lg">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-12 md:py-20 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div className="animate-fade-in-slide-in-from-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Modern Healthcare <span className="text-primary">Information System</span>
            </h1>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-muted-foreground">
              Streamline your healthcare operations with our comprehensive platform. 
              Manage patient records, appointments, billing, and more in one secure place.
            </p>
            <div className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto animate-bounce-short hover:animate-none">
                  Get Started
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="w-full sm:w-auto animate-fade-in">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative mt-8 md:mt-0 animate-fade-in-slide-in-from-right">
            <div className="aspect-video md:aspect-[5/3]">
              <div className="w-full h-full rounded-lg bg-gradient-to-r from-primary/20 to-primary/40 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-4xl text-primary/80">
                  {/* Placeholder for a healthcare-related image */}
                  <div className="relative h-[200px] sm:h-[250px] md:h-[300px] w-full">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Healthcare Dashboard Preview
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-12 md:py-20 px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-16 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold">Comprehensive Healthcare Management</h2>
          <p className="mt-3 md:mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the tools you need to efficiently manage your healthcare facility
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              title: "Patient Management",
              description: "Manage patient records, medical history, and personal information securely.",
              icon: "👥",
              delay: "delay-100",
            },
            {
              title: "Appointment Scheduling",
              description: "Streamline appointment booking and management with calendar integration.",
              icon: "📅",
              delay: "delay-200",
            },
            {
              title: "Billing & Reports",
              description: "Generate invoices, track payments, and create comprehensive reports.",
              icon: "📊",
              delay: "delay-300",
            },
          ].map((feature, index) => (
            <Card 
              key={index} 
              className={`p-6 hover:shadow-lg transition-all duration-300 dark:hover:bg-slate-800/50 animate-fade-in-slide-up ${feature.delay}`}
            >
              <div className="text-3xl md:text-4xl mb-4 animate-bounce-slow">{feature.icon}</div>
              <h3 className="text-lg md:text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/50 dark:bg-slate-900/50 py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-16 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold">Trusted by Healthcare Professionals</h2>
            <p className="mt-3 md:mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our users have to say about our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {[
              {
                quote: "This system has completely transformed how we manage our clinic. Patient records are now easily accessible and secure.",
                author: "Dr. Sarah Johnson",
                role: "Medical Director",
                delay: "delay-100",
              },
              {
                quote: "The scheduling system has reduced our no-show rate by 35%. The patient reminders are a game-changer.",
                author: "Michael Chen",
                role: "Clinic Administrator",
                delay: "delay-200",
              },
            ].map((testimonial, index) => (
              <Card 
                key={index} 
                className={`p-6 dark:bg-slate-800/50 animate-fade-in-slide-up ${testimonial.delay} hover:scale-[1.02] transition-transform duration-300`}
              >
                <blockquote className="text-base md:text-lg italic mb-4">"{testimonial.quote}"</blockquote>
                <div className="font-medium">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-12 md:py-20 px-4 sm:px-6">
        <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-6 md:p-10 text-center animate-fade-in-slide-up">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ready to transform your healthcare operations?</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who have streamlined their operations with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto animate-pulse-slow hover:animate-none">
                Create an Account
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="w-full sm:w-auto animate-fade-in">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-8 md:py-10 animate-fade-in">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">H</span>
              </div>
              <span className="font-bold">Healthcare IS</span>
            </div>
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <ThemeToggle />
              <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                Sign In
              </Link>
              <Link href="/sign-up" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                Sign Up
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Healthcare Information System. All rights reserved.
              <br /> Developed by <Link href="https://github.com/bizzy604" className="text-primary hover:underline">Amoni Kevin</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
