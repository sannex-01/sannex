import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Lightbulb, Users } from 'lucide-react';
import VideoBackground from '@/components/VideoBackground';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'We build technology that solves real problems and creates measurable value for our clients.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'We stay ahead of technology trends, bringing cutting-edge AI and automation to every project.',
    },
    {
      icon: Users,
      title: 'Client Partnership',
      description: 'We work as an extension of your team, ensuring solutions align with your business goals.',
    },
  ];

  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      
      <div className="relative z-10 pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in py-20 md:py-32">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Who We Are
              </h1>
              <p className="text-xl text-muted-foreground">
                Building intelligent systems that transform how businesses operate
              </p>
            </div>

            <div className="prose prose-lg max-w-none mb-16 animate-fade-in">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Our Story</h2>
                  <p className="text-muted-foreground mb-4">
                    Sannex was founded with a clear mission: to make advanced technology 
                    accessible and practical for African businesses. Based in Lagos, Nigeria, we specialize 
                    in AI-powered automation, custom web development, and seamless system integrations.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    We've worked with churches automating their operations, universities building 
                    management systems, startups launching payment platforms, and enterprises 
                    optimizing their workflows. Every project teaches us something new, and we bring 
                    that knowledge to the next challenge.
                  </p>
                  <p className="text-muted-foreground">
                    Our approach combines technical excellence with practical business thinking. 
                    We don't just build software—we build solutions that scale, systems that last, 
                    and partnerships that grow.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">
                Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <Card
                      key={index}
                      className="text-center animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="pt-6">
                        <div className="h-12 w-12 rounded-lg bg-primary-light flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground">
                          {value.title}
                        </h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="mb-16 animate-fade-in">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">
                    Our Expertise
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-3 text-foreground">Technologies</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• React, TypeScript, Next.js</li>
                        <li>• Django, FastAPI, Node.js</li>
                        <li>• PostgreSQL, MongoDB, Redis</li>
                        <li>• AWS, Docker, CI/CD</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 text-foreground">Specializations</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• AI & Machine Learning</li>
                        <li>• Workflow Automation (n8n)</li>
                        <li>• Payment Integrations</li>
                        <li>• API Development</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center animate-fade-in">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Ready to work together?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you need AI automation, a custom web application, or technical consulting, 
                we're here to help you build something great.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">Get in Touch</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/projects">View Our Work</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
