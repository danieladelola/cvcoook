import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, Quote, CheckCircle, Users, Award, ThumbsUp } from "lucide-react";

const Reviews = () => {
  const stats = [
    { label: "Happy Users", value: "2M+", icon: Users },
    { label: "5-Star Reviews", value: "50K+", icon: Star },
    { label: "CVs Created", value: "10M+", icon: Award },
    { label: "Success Rate", value: "94%", icon: ThumbsUp },
  ];

  const featuredReviews = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      company: "Tech Startup",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      title: "Landed my dream job in 2 weeks!",
      review: "I was struggling with my CV for months. CVBuilder's AI suggestions helped me highlight my achievements in a way that really resonated with recruiters. Within 2 weeks of updating my CV, I had 5 interview requests and landed my dream job!",
      date: "January 2024"
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      company: "Fortune 500",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      title: "The ATS checker is a game-changer",
      review: "As a developer, I never thought much about ATS systems. The ATS checker showed me exactly why my applications were getting rejected. After optimizing my CV with their suggestions, my response rate went from 5% to over 40%!",
      date: "December 2023"
    },
    {
      name: "Emily Rodriguez",
      role: "Recent Graduate",
      company: "University of California",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      title: "Perfect for career starters",
      review: "As a new graduate with limited experience, I didn't know how to make my CV stand out. The templates and AI suggestions helped me present my internships and projects professionally. Got my first full-time job offer within a month!",
      date: "January 2024"
    },
    {
      name: "David Thompson",
      role: "Senior Consultant",
      company: "Big 4 Firm",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      title: "Worth every penny",
      review: "I've used many CV builders over my 15-year career, and this is by far the best. The professional templates, easy customization, and AI-powered content suggestions make it worth the investment. Highly recommend the Pro plan!",
      date: "November 2023"
    },
    {
      name: "Lisa Park",
      role: "Healthcare Professional",
      company: "Major Hospital",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      title: "Industry-specific templates are excellent",
      review: "Finding a CV template that works for healthcare was always challenging. CVBuilder has templates specifically designed for medical professionals that highlight certifications and clinical experience properly. Excellent tool!",
      date: "December 2023"
    },
    {
      name: "James Wilson",
      role: "Career Changer",
      company: "Former Teacher",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      title: "Made career transition seamless",
      review: "Transitioning from teaching to corporate training seemed daunting. The AI helped me translate my classroom experience into corporate language. The cover letter generator was especially helpful in explaining my career change story.",
      date: "January 2024"
    },
  ];

  const platformReviews = [
    { platform: "Trustpilot", rating: 4.8, reviews: "12,000+" },
    { platform: "G2", rating: 4.7, reviews: "3,500+" },
    { platform: "Capterra", rating: 4.9, reviews: "2,800+" },
    { platform: "App Store", rating: 4.8, reviews: "8,500+" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-8 w-8 fill-secondary text-secondary" />
            ))}
          </div>
          <h1 className="font-heading text-3xl font-bold text-white md:text-5xl mb-4">
            Loved by Millions of Job Seekers
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            See why over 2 million professionals trust CVBuilder to create winning resumes and land their dream jobs.
          </p>
          <Link to="/register">
            <Button variant="coral" size="lg">Join Our Community</Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="feature-icon mx-auto mb-3">
                  <stat.icon className="h-6 w-6 text-secondary" />
                </div>
                <div className="font-heading text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Ratings */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <h2 className="font-heading text-xl font-semibold text-center text-primary mb-8">
            Top Rated Across All Platforms
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {platformReviews.map((platform, index) => (
              <div key={index} className="bg-card rounded-xl p-4 text-center border border-border">
                <div className="font-semibold text-primary mb-2">{platform.platform}</div>
                <div className="flex justify-center gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(platform.rating) ? 'fill-secondary text-secondary' : 'text-muted'}`} 
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {platform.rating}/5 • {platform.reviews} reviews
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Reviews */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl font-bold text-primary md:text-4xl mb-4">
              Success Stories from Our Users
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real stories from real people who transformed their careers with CVBuilder
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredReviews.map((review, index) => (
              <div 
                key={index} 
                className="bg-card rounded-xl p-6 border border-border card-hover relative"
              >
                <Quote className="absolute top-4 right-4 h-8 w-8 text-secondary/20" />
                
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={review.image} 
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-primary">{review.name}</div>
                    <div className="text-sm text-muted-foreground">{review.role}</div>
                  </div>
                </div>
                
                <div className="flex gap-0.5 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                
                <h3 className="font-semibold text-primary mb-2">{review.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {review.review}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-accent" />
                    Verified User
                  </span>
                  <span>{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials Placeholder */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl mb-4">
              Watch Success Stories
            </h2>
            <p className="text-muted-foreground">
              Hear directly from users who landed their dream jobs
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              { title: "From Unemployed to Tech Lead", duration: "3:45" },
              { title: "Career Change at 40", duration: "4:12" },
              { title: "First Job After College", duration: "2:58" },
            ].map((video, index) => (
              <div 
                key={index}
                className="bg-primary/90 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-semibold text-white text-sm">{video.title}</div>
                  <div className="text-white/70 text-xs">{video.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="hero-gradient rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-heading text-2xl font-bold text-white md:text-4xl mb-4">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Join over 2 million professionals who have transformed their careers with CVBuilder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="coral" size="lg">Create Your CV Now</Button>
              </Link>
              <Link to="/templates">
                <Button variant="heroOutline" size="lg">Browse Templates</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Reviews;
