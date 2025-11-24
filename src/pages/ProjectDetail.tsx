import { useParams, Link } from 'react-router-dom';
import { mockProjects } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, CheckCircle2 } from 'lucide-react';

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = mockProjects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Button asChild>
            <Link to="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="mb-8">
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary" className="text-sm">
                {project.category}
              </Badge>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  View Live <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-muted-foreground">{project.shortDescription}</p>
          </div>

          <div className="mb-8 animate-fade-in">
            <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {project.problem && (
            <Card className="mb-8 animate-slide-up">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3 text-foreground">The Challenge</h3>
                <p className="text-muted-foreground">{project.problem}</p>
              </CardContent>
            </Card>
          )}

          {project.solution && (
            <Card className="mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3 text-foreground">Our Solution</h3>
                <p className="text-muted-foreground mb-4">{project.solution}</p>
                <p className="text-muted-foreground">{project.fullDescription}</p>
              </CardContent>
            </Card>
          )}

          {project.features && project.features.length > 0 && (
            <Card className="mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Key Features</h3>
                <ul className="space-y-3">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {project.result && (
            <Card className="mb-8 bg-primary text-primary-foreground animate-slide-up" style={{ animationDelay: '300ms' }}>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3">Results & Impact</h3>
                <p className="text-lg">{project.result}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button asChild size="lg">
              <a href="https://calendly.com/sannex/book-free-consultation" target="_blank" rel="noopener noreferrer">Start Your Project</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/projects">View More Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
