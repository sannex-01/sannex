export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  techStack: string[];
  problem?: string;
  solution?: string;
  features?: string[];
  result?: string;
  liveUrl?: string;
  demoUrl?: string;
  status: 'published' | 'draft';
  createdAt: string;
}

export interface HomepageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCTA: string;
  heroPrimaryLink: string;
  heroSecondaryCTA?: string;
  heroSecondaryLink?: string;
  services: Service[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}
