import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Small Business Owner",
      location: "Mumbai",
      rating: 5,
      text: "Shoogle helped me sell my handmade jewelry online in just minutes! The AI understood exactly what I was selling and connected me with the right buyers.",
      avatar: "PS",
    },
    {
      name: "Rahul Gupta",
      role: "Tech Enthusiast",
      location: "Delhi",
      rating: 5,
      text: "Found the perfect gaming laptop through just a simple chat. No endless scrolling through categories - just told them what I needed and got perfect matches!",
      avatar: "RG",
    },
    {
      name: "Sneha Patel",
      role: "Fashion Designer",
      location: "Bangalore",
      rating: 5,
      text: "The conversational interface made listing my products so easy. It's like having a personal assistant that helps both sellers and buyers find each other.",
      avatar: "SP",
    },
  ];

  return (
    <section className="max-w-full overflow-x-hidden bg-background px-2 py-12 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 px-1 text-center sm:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent sm:mb-6">
            <Star className="h-4 w-4" />
            What People Say
          </div>
          <h2 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-4xl lg:text-5xl">
            <span className="text-foreground">Loved by</span>
            <br />
            <span className="gradient-text">Thousands of Users</span>
          </h2>
          <p className="mx-auto max-w-full text-base text-muted-foreground sm:max-w-2xl sm:text-lg">
            Real stories from real people who've discovered the magic of conversational commerce.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid max-w-full grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-2 bg-card/50 backdrop-blur-xs transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
            >
              <CardContent className="p-5 sm:p-8">
                {/* Quote Icon */}
                <div className="mb-4 text-primary/20 sm:mb-6">
                  <Quote className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>

                {/* Rating */}
                <div className="mb-3 flex gap-1 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-accent" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="mb-4 break-words text-sm leading-relaxed text-muted-foreground sm:mb-6 sm:text-base">
                  "{testimonial.text}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-[#e0a800] to-[#fdd676] font-semibold text-white sm:h-12 sm:w-12">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold sm:text-base">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground sm:text-sm">{testimonial.role}</p>
                    <Badge variant="outline" className="mt-1 text-[10px] sm:text-xs">
                      {testimonial.location}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Proof Stats */}
        <div className="mt-10 grid w-full grid-cols-2 gap-6 text-center sm:mt-16 sm:gap-8 lg:grid-cols-4">
          <div>
            <div className="gradient-text mb-1 text-2xl font-bold sm:mb-2 sm:text-3xl">10K+</div>
            <div className="text-xs text-muted-foreground sm:text-base">Happy Sellers</div>
          </div>
          <div>
            <div className="gradient-text mb-1 text-2xl font-bold sm:mb-2 sm:text-3xl">50K+</div>
            <div className="text-xs text-muted-foreground sm:text-base">Products Listed</div>
          </div>
          <div>
            <div className="gradient-text mb-1 text-2xl font-bold sm:mb-2 sm:text-3xl">100K+</div>
            <div className="text-xs text-muted-foreground sm:text-base">Successful Matches</div>
          </div>
          <div>
            <div className="gradient-text mb-1 text-2xl font-bold sm:mb-2 sm:text-3xl">4.9★</div>
            <div className="text-xs text-muted-foreground sm:text-base">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
