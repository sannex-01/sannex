import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  isBackgroundMusicPlaying,
  playBackgroundMusic,
  subscribeToBackgroundMusic,
} from "@/lib/backgroundMusic";
import VideoBackground from "@/components/VideoBackground";
import {
  Award,
  ArrowRight,
  Bot,
  BadgeDollarSign,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Code2,
  Globe,
  Hourglass,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import userAvatar from "@/assets/user.svg";
import echannyIdaguImage from "@/assets/members/echanny-idagu.jpg";
import emmanuelAdemolaImage from "@/assets/members/emmanuel-ademola.jpg";
import mosesOoseImage from "@/assets/members/moses-oose.jpg";
import ogunyankinImage from "@/assets/members/ogunyankin.jpg";
import peterIdowuImage from "@/assets/members/peter-idowu.jpg";
import severImage from "@/assets/members/sever.jpg";
import tolulopeAdebisiImage from "@/assets/members/tolulope-adebisi.jpg";
import ai3dStudioImage from "@/assets/projects/ai3dstudio.png";
import bellaAiImage from "@/assets/projects/bellaAI.png";
import nivasityAppImage from "@/assets/projects/nivasityapp.png";
import sannexAiImage from "@/assets/projects/sannexAI.png";
import slackAgentImage from "@/assets/projects/slackagent.png";
import truCycleImage from "@/assets/projects/trucycle.png";

const SELAR_REGISTRATION_URL = "https://selar.com/1671275235";
const TESTIMONIAL_ROTATION_MS = 10000;

const snapshotItems = [
  { label: "Start", value: "April 1", icon: CalendarDays },
  { label: "Duration", value: "3 months", icon: Hourglass },
  { label: "Commitment", value: "3 days weekly", icon: Clock3 },
  { label: "Format", value: "Cohort + collaboration", icon: Sparkles },
  { label: "Tracks", value: "AI Team and Web Team", icon: Users },
  { label: "Price", value: "\u20A6100,000 / $100", icon: BadgeDollarSign },
];

const programFlow = [
  {
    title: "Learn",
    text: "Structured weekly training with clear direction and accountability.",
    icon: Sparkles,
  },
  {
    title: "Build",
    text: "Real tasks and collaborative project work that mirrors real product teams.",
    icon: Code2,
  },
  {
    title: "Show",
    text: "Demos, portfolio proof, and confidence to explain what you built.",
    icon: Users,
  },
];

const whoForItems = [
  "Beginners who can commit weekly",
  "People with or without coding skills who are ready to learn by building",
  "Developers who want structure and accountability",
  "People tired of tutorials who want real projects",
  "Students and early professionals building a portfolio",
  "Anyone who wants to work in a team environment",
];

const notForItems = [
  "If you want a one-day crash course",
  "If you cannot commit time weekly",
];

const timeline = [
  {
    month: "Month 1",
    title: "Foundation and Skill Lift",
    points: [
      "Tools, fundamentals, and mini tasks",
      "Team onboarding and working style",
      "First mini project shipped",
    ],
  },
  {
    month: "Month 2",
    title: "Building Real Products",
    points: [
      "Bigger projects and collaboration",
      "Code reviews and feedback loops",
      "Mid-program demo day",
    ],
  },
  {
    month: "Month 3",
    title: "Portfolio and Proof",
    points: [
      "Final product sprint",
      "Final demo and portfolio polishing",
      "Showcase and optional recommendations",
    ],
  },
];

const deliveredProjects = [
  {
    title: "Nivasity Mobile App",
    track: "Web Team",
    details:
      "A mobile platform designed to help students access campus services, manage payments, and interact with the Nivasity ecosystem seamlessly from their phones. The app focuses on speed, simplicity, and real-time student engagement.",
    image: nivasityAppImage,
  },
  {
    title: "SID Media AI Agent",
    track: "Both AI & Web Teams",
    details:
      "An AI automation system built for a video editing company to manage client acquisition, handle customer conversations, and generate contract agreements automatically. It streamlines operations and enhances client engagement for the media company.",
    image: sannexAiImage,
  },
  {
    title: "TruCycle",
    track: "Web Team",
    details:
      "A digital platform that supports circular economy initiatives by helping communities manage recyclable materials and track sustainability efforts. It connects individuals and organizations to better recycling and waste management systems.",
    image: truCycleImage,
  },
  {
    title: "Internal Slack Support Agent",
    track: "AI Team",
    details:
      "An AI assistant integrated with Slack to automate internal support, answer team questions, and help manage operational requests quickly. It reduces response time and increases efficiency for internal communications.",
    image: slackAgentImage,
  },
  {
    title: "Nivasity Bella AI Support Agent",
    track: "AI Team",
    details:
      "Bella is an AI support assistant built for the Nivasity platform to help students resolve issues, track payments, and get instant support without waiting for human intervention.",
    image: bellaAiImage,
  },
  {
    title: "AI3D Studio",
    track: "Both AI & Web Teams",
    details:
      "A creative AI platform that allows users to design and generate 3D-ready models and concepts using artificial intelligence, helping bridge digital design and physical production.",
    image: ai3dStudioImage,
  },
  {
    title: "Sannex Support AI Agent",
    track: "AI Team",
    details:
      "An internal AI assistant designed to handle support requests, answer common questions, and assist users interacting with Sannex services and programs.",
    image: sannexAiImage,
  },
];

const beforeAfterStories = [
  {
    before: "Could not structure a project alone.",
    now: "Shipped my first working app with a team.",
  },
  {
    before: "Struggled with Git workflow and collaboration.",
    now: "Can manage branches, pull requests, and team reviews.",
  },
  {
    before: "Only consumed tutorials with no output.",
    now: "Builds consistently and presents demos confidently.",
  },
  {
    before: "No clear portfolio direction.",
    now: "Has portfolio-ready projects and project writeups.",
  },
  {
    before: "Was unsure between AI and Web path.",
    now: "Understands track strengths and ships with purpose.",
  },
  {
    before: "Low confidence explaining technical choices.",
    now: "Can explain product decisions and implementation steps.",
  },
];

const infiniteBeforeAfterStories = [
  ...beforeAfterStories,
  ...beforeAfterStories,
  ...beforeAfterStories,
];

const infiniteDeliveredProjects = [
  ...deliveredProjects,
  ...deliveredProjects,
  ...deliveredProjects,
];

const metrics = [
  { label: "Weeks completed", value: "12+" },
  { label: "Projects built", value: "10+" },
  { label: "Tasks done", value: "50+" },
  { label: "Live sessions", value: "30+" },
  { label: "Active members", value: "9+" },
];

const testimonials = [
  {
    quote:
      "I am truly grateful for the opportunity to learn and grow with Sannex Tech. Their training programs delivered a solid and practical foundation in AI automation and web development, transforming theoretical concepts into real-world skills.",
    name: "Echanny Idagu",
    image: echannyIdaguImage,
  },
  {
    quote:
      "I sincerely appreciate the opportunity to gain additional skills with Sannex Tech. The opportunity provided me with a strong, hands-on understanding of AI automation and web development, bridging the gap between theory and practical application. Through their well-structured programs, I was able to gain real-world experience and confidence that has significantly enhanced my technical growth.",
    name: "Ogunyankin Olumuyiwa",
    image: ogunyankinImage,
  },
  {
    quote:
      "My Honest Review!\nI've attended several online trainings before, and to be honest, many of them didn't really make sense. Sometimes after just one or two days, they would start asking for extra payments to sell a material to you.\nSo when I came across this one, I honestly thought it was going to be the same thing.\nBut I was wrong.\nFrom the moment we started, I could see this was different from what I was expecting. It wasn't about hype, it was real teaching. It was clear, practical, and very educative.\nI genuinely learned a lot. The sessions were detailed, easy to understand, and full of valuable information. I didn't feel like my time was wasted at all.",
    name: "Sever",
    image: severImage,
  },
  {
    quote:
      "Some opportunities don't come glaring as they should look, but they hold more value than the shiny one's.\n\nI'm glad I saw this, and against all odds was able to participate actively\n\nIt's a whole new world of possibilities for me ever since.",
    name: "Tolulope Adebisi",
    image: tolulopeAdebisiImage,
  },
  {
    quote:
      "Sannex Technology provided me with a top-tier learning experience. Their focus on the intersection of AI automation and modern web development has given me a unique edge in creating efficient, automated workflows for the web. Indeed, it's a transformative program.",
    name: "Oluwaseyi",
  },
  {
    quote:
      "Sannex AI Mentorship is not just teaching AI - it's building real builders.\nWe don't just watch tutorials, we get our hands dirty with real projects. The mentorship is practical, intense, and growth-driven.\nKnowledge is sharpened. Minds are stretched. Confidence is built.",
    name: "Peter Idowu",
    image: peterIdowuImage,
  },
  {
    quote: "I really appreciate the knowledge sannex has imparted in me\nThanks so much",
    name: "Moses Oose",
    image: mosesOoseImage,
  },
  {
    quote:
      "I am grateful that I perceived the depth of this opportunity and, despite numerous challenges, chose to engage fully and intentionally.\nMy experience with Sannex Tech has been transformative. What initially seemed understated has unfolded into a platform of learning, growth, and innovation that continues to expand my perspective. Through active participation, I have gained not only technical exposure but also a renewed confidence in my ability to adapt, contribute, and excel in a dynamic environment.",
    name: "Emmanuel Ademola",
    image: emmanuelAdemolaImage,
  },
];

const faqs = [
  {
    question: "How many hours per week should I commit?",
    answer:
      "The program runs 3 days each week. Plan dedicated time for training, build tasks, and review/demo sessions.",
  },
  {
    question: "Is it beginner friendly?",
    answer:
      "Yes. The structure is designed for beginners who are willing to stay consistent and complete weekly tasks.",
  },
  {
    question: "Do I need a laptop?",
    answer:
      "Yes. You need a working laptop and stable internet access to participate effectively.",
  },
  {
    question: "What if I miss a week?",
    answer:
      "You can catch up using shared materials and support from your team, but consistency is strongly encouraged.",
  },
  {
    question: "Do I get recordings?",
    answer:
      "Session recording policy is shared during onboarding. Core guidance and task updates are posted in the cohort space.",
  },
  {
    question: "Is there mentorship and review?",
    answer:
      "Yes. The weekly rhythm includes review and feedback loops so your work improves continuously.",
  },
  {
    question: "What is the difference between AI and Web tracks?",
    answer:
      "AI focuses on practical AI features and automation. Web focuses on frontend/backend product delivery. Both collaborate.",
  },
  {
    question: "Can I switch tracks later?",
    answer:
      "Track adjustments may be possible based on capacity and fit. Final guidance is provided during onboarding.",
  },
  {
    question: "Can I join if I do not have coding skills yet?",
    answer:
      "Yes. AIM-T is designed for learners with or without coding skills. What matters most is commitment and consistency.",
  },
];

const HapticCard = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Card>) => (
  <Card
    className={cn(
      "transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.985] will-change-transform",
      className,
    )}
    {...props}
  />
);

const RevealSection = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"section">) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
};

const AIMT = () => {
  const storyWallRef = useRef<HTMLDivElement | null>(null);
  const storyCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const projectWallRef = useRef<HTMLDivElement | null>(null);
  const projectCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeStoryLoopIndexRef = useRef(beforeAfterStories.length);
  const activeProjectLoopIndexRef = useRef(deliveredProjects.length);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [projectCardHeight, setProjectCardHeight] = useState<number | null>(null);
  const [heroHoveredIndex, setHeroHoveredIndex] = useState<number | null>(null);
  const [heroHasAnimated, setHeroHasAnimated] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(false);
  const heroTitle = "AIM-T - Build Real AI and Web Products in 90 Days";
  const heroWords = heroTitle.split(" ");

  useEffect(() => {
    let currentIndex = 0;
    const interval = window.setInterval(() => {
      if (currentIndex < heroWords.length) {
        setHeroHoveredIndex(currentIndex);
        currentIndex += 1;
      } else {
        window.clearInterval(interval);
        setHeroHasAnimated(true);
        setHeroHoveredIndex(null);
      }
    }, 600);

    return () => window.clearInterval(interval);
  }, [heroWords.length]);

  useEffect(() => {
    const container = storyWallRef.current;
    if (!container) return;
    if (beforeAfterStories.length === 0) return;

    const updateActiveStory = () => {
      const singleSetWidth = container.scrollWidth / 3;
      if (container.scrollLeft < singleSetWidth * 0.75) {
        container.scrollLeft += singleSetWidth;
      } else if (container.scrollLeft > singleSetWidth * 2.25) {
        container.scrollLeft -= singleSetWidth;
      }

      const viewportCenter = container.scrollLeft + container.clientWidth / 2;
      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      storyCardRefs.current.forEach((card, index) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      });

      activeStoryLoopIndexRef.current = nearest;
      setActiveStoryIndex(nearest % beforeAfterStories.length);
    };

    const scrollToStory = (loopIndex: number) => {
      const card = storyCardRefs.current[loopIndex];
      if (!card) return;
      const left = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
      container.scrollTo({ left, behavior: "smooth" });
    };

    const initializeStoryLoop = () => {
      const middleIndex = beforeAfterStories.length;
      const middleCard = storyCardRefs.current[middleIndex];
      if (!middleCard) return;
      const left = middleCard.offsetLeft - (container.clientWidth - middleCard.clientWidth) / 2;
      container.scrollLeft = left;
      activeStoryLoopIndexRef.current = middleIndex;
      updateActiveStory();
    };

    requestAnimationFrame(initializeStoryLoop);

    const autoScroll = window.setInterval(() => {
      if (container.matches(":hover")) return;
      scrollToStory(activeStoryLoopIndexRef.current + 1);
    }, 2800);

    container.addEventListener("scroll", updateActiveStory, { passive: true });
    window.addEventListener("resize", updateActiveStory);

    return () => {
      window.clearInterval(autoScroll);
      container.removeEventListener("scroll", updateActiveStory);
      window.removeEventListener("resize", updateActiveStory);
    };
  }, []);

  useEffect(() => {
    const container = projectWallRef.current;
    if (!container) return;
    if (deliveredProjects.length === 0) return;

    const syncProjectCardHeights = () => {
      const heights = projectCardRefs.current
        .map((card) => card?.offsetHeight ?? 0)
        .filter((height) => height > 0);
      if (heights.length === 0) return;
      setProjectCardHeight(Math.max(...heights));
    };

    const updateActiveProject = () => {
      const singleSetWidth = container.scrollWidth / 3;
      if (container.scrollLeft < singleSetWidth * 0.75) {
        container.scrollLeft += singleSetWidth;
      } else if (container.scrollLeft > singleSetWidth * 2.25) {
        container.scrollLeft -= singleSetWidth;
      }

      const viewportCenter = container.scrollLeft + container.clientWidth / 2;
      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      projectCardRefs.current.forEach((card, index) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      });

      activeProjectLoopIndexRef.current = nearest;
      setActiveProjectIndex(nearest % deliveredProjects.length);
    };

    const scrollToProject = (loopIndex: number) => {
      const card = projectCardRefs.current[loopIndex];
      if (!card) return;
      const left = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
      container.scrollTo({ left, behavior: "smooth" });
    };

    const initializeProjectLoop = () => {
      const middleIndex = deliveredProjects.length;
      const middleCard = projectCardRefs.current[middleIndex];
      if (!middleCard) return;
      const left = middleCard.offsetLeft - (container.clientWidth - middleCard.clientWidth) / 2;
      container.scrollLeft = left;
      activeProjectLoopIndexRef.current = middleIndex;
      updateActiveProject();
      syncProjectCardHeights();
    };

    requestAnimationFrame(initializeProjectLoop);

    const autoScroll = window.setInterval(() => {
      if (container.matches(":hover")) return;
      scrollToProject(activeProjectLoopIndexRef.current + 1);
    }, 3400);

    container.addEventListener("scroll", updateActiveProject, { passive: true });
    window.addEventListener("resize", updateActiveProject);
    window.addEventListener("resize", syncProjectCardHeights);

    return () => {
      window.clearInterval(autoScroll);
      container.removeEventListener("scroll", updateActiveProject);
      window.removeEventListener("resize", updateActiveProject);
      window.removeEventListener("resize", syncProjectCardHeights);
    };
  }, []);

  useEffect(() => {
    const testimonialTicker = window.setInterval(() => {
      setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, TESTIMONIAL_ROTATION_MS);

    return () => window.clearInterval(testimonialTicker);
  }, []);

  useEffect(() => {
    if (!isBackgroundMusicPlaying()) {
      setShowMusicPrompt(true);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToBackgroundMusic((isPlaying) => {
      // If user starts music from the header while prompt is open, close it.
      if (isPlaying) {
        setShowMusicPrompt(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleContinueWithMusic = async () => {
    const started = await playBackgroundMusic();
    if (started || isBackgroundMusicPlaying()) {
      setShowMusicPrompt(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {showMusicPrompt && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/65 px-4 backdrop-blur-md">
          <Card className="w-full max-w-md border-primary/30 bg-background/95 shadow-xl">
            <CardHeader>
              <CardTitle>Music Notice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Music will start while you are on this page. Click continue to play.
              </p>
              <Button onClick={handleContinueWithMusic} className="w-full">
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <VideoBackground fixed />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/5 to-background" />
        <div className="container relative z-10 mx-auto px-4 pb-20 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-4 py-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Limited slots. Cohort-based. Weekly reviews.
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              {heroWords.map((word, index) => (
                <span key={`${word}-${index}`} className="mr-3 inline-block">
                  <span
                    onMouseEnter={() => heroHasAnimated && setHeroHoveredIndex(index)}
                    onMouseLeave={() => heroHasAnimated && setHeroHoveredIndex(null)}
                    className={cn(
                      "inline-block cursor-pointer transition-all duration-300",
                      index === heroHoveredIndex &&
                        "scale-105 rounded-md bg-primary px-2 py-1 text-primary-foreground",
                    )}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h1>
            <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
              Starts April 1. Runs for 3 months. Hands-on training, team collaboration, and
              portfolio-focused delivery for learners with or without coding skills.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="group">
                <a href={SELAR_REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
                  Register NOW!
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#current-cohort">See current cohort progress</a>
              </Button>
            </div>
            <p className="mt-4 text-base text-muted-foreground">
              Payment is handled securely on Selar. Program details live here on Sannex.
            </p>
          </div>
        </div>
      </section>

      <RevealSection className="bg-zinc-950 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {snapshotItems.map((item) => (
              <HapticCard key={item.label} className="border-zinc-700 bg-zinc-900 text-zinc-100">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-md">
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-base text-zinc-400">{item.label}</p>
                      <p className="mt-1 text-xl font-semibold text-zinc-100">{item.value}</p>
                    </div>
                  </div>
                </CardContent>
              </HapticCard>
            ))}
          </div>

          <div className="mt-14 max-w-4xl">
            <h2 className="text-3xl font-bold text-zinc-100 md:text-4xl">What AIM-T Is</h2>
            <p className="mt-4 text-lg text-zinc-300">
              AIM-T is a cohort program where you learn by building. You join a track for focus,
              but everyone collaborates like one product team. The goal is simple: projects, proof,
              and confidence. You can join with or without coding skills as long as you can commit.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {programFlow.map((item) => {
              const Icon = item.icon;
              return (
                <HapticCard key={item.title} className="border-zinc-700 bg-zinc-900 text-zinc-100">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-300">{item.text}</p>
                  </CardContent>
                </HapticCard>
              );
            })}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="bg-background py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <HapticCard>
              <CardHeader>
                <CardTitle>Who This Is For</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {whoForItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                    <p className="text-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </HapticCard>

            <HapticCard>
              <CardHeader>
                <CardTitle>Not for You If...</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notForItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <XCircle className="mt-0.5 h-5 w-5 text-destructive" />
                    <p className="text-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </HapticCard>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="bg-background pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold md:text-4xl">Curriculum Timeline</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {timeline.map((phase) => (
              <HapticCard key={phase.month} className="h-full">
                <CardHeader>
                  <p className="text-base font-semibold text-primary">{phase.month}</p>
                  <CardTitle>{phase.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {phase.points.map((point) => (
                    <div key={point} className="flex items-start gap-2">
                      <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                      <p className="text-muted-foreground">{point}</p>
                    </div>
                  ))}
                </CardContent>
              </HapticCard>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection id="current-cohort" className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-zinc-950/60" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-zinc-100 md:text-4xl">
              AIM-T25 Progress (First Cohort: Dec 2025 - March 31, 2026)
            </h2>
            <p className="mt-4 text-lg text-zinc-200">
              AIM-T25 is the first and current cohort, ending on March 31, 2026. This is the proof
              section that showcases the amazing projects the cohort delivered.
            </p>
          </div>

          <h3 className="mt-10 text-2xl font-semibold text-zinc-100 md:text-3xl">
            Two Teams, One Mission
          </h3>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <HapticCard className="border-zinc-700 bg-green-900 text-zinc-100 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-zinc-100">
                <p>Prompting and practical RAG basics where relevant.</p>
                <p>Chatbots, assistant flows, and automation logic.</p>
                <p>Data, APIs, model usage, and AI product integration.</p>
              </CardContent>
            </HapticCard>
            <HapticCard className="border-zinc-700 bg-green-900 text-zinc-100 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Web Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-zinc-100">
                <p>Frontend/backend fundamentals for real product delivery.</p>
                <p>APIs, auth, dashboards, and team-based shipping.</p>
                <p>Product polish, deployment, and performance basics.</p>
              </CardContent>
            </HapticCard>
          </div>
          <p className="mt-5 text-lg font-semibold text-zinc-200">
            We split by track, but we ship together.
          </p>

          <div className="mt-8 grid gap-4 grid-cols-2 lg:grid-cols-5">
            {metrics.map((metric) => (
              <HapticCard
                key={metric.label}
                className="border-zinc-700 bg-zinc-900/85 text-zinc-100 backdrop-blur-sm"
              >
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-primary">{metric.value}</p>
                  <p className="mt-1 text-base text-zinc-300">{metric.label}</p>
                </CardContent>
              </HapticCard>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="bg-zinc-950 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-zinc-100 md:text-4xl">
            Projects Built by the Current AIM-T Cohort
          </h3>
          <p className="mt-3 max-w-3xl text-zinc-300">
            Real products delivered across AI and Web tracks by the active AIM-T cohort.
          </p>
          <div
            ref={projectWallRef}
            className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-visible px-1 py-6"
          >
            {infiniteDeliveredProjects.map((project, loopIndex) => {
              const dataIndex = loopIndex % deliveredProjects.length;
              const isActive = activeProjectIndex === dataIndex;

              return (
                <div
                  key={`${project.title}-${loopIndex}`}
                  ref={(node) => {
                    projectCardRefs.current[loopIndex] = node;
                  }}
                  className={cn(
                    "snap-center shrink-0 w-[300px] md:w-[420px] transition-all duration-500 ease-out",
                    isActive ? "scale-100 opacity-100 md:scale-105" : "scale-95 opacity-70",
                  )}
                  style={projectCardHeight ? { height: `${projectCardHeight}px` } : undefined}
                >
                  <HapticCard
                    className={cn(
                      "h-full overflow-hidden bg-zinc-900 text-zinc-100",
                      isActive ? "border-primary/60 shadow-card-hover" : "border-zinc-700/70",
                    )}
                  >
                    <img
                      src={project.image}
                      alt={`${project.title} preview`}
                      className="h-44 w-full object-cover"
                      loading="lazy"
                    />
                    <CardContent className="pt-6">
                      <p className="text-base font-semibold text-primary">{project.track}</p>
                      <p className="mt-1 text-lg font-semibold text-zinc-100">{project.title}</p>
                      <p className="mt-2 text-zinc-300">{project.details}</p>
                    </CardContent>
                  </HapticCard>
                </div>
              );
            })}
          </div>

          <div className="mx-auto mt-16 max-w-2xl text-center">
            <h4 className="text-2xl font-semibold text-zinc-100 md:text-3xl">Testimonials</h4>
            <p className="mt-2 text-zinc-300">One voice at a time from AIM-T25 members.</p>
            <div className="mt-6">
              {testimonials.map((item, index) =>
                activeTestimonialIndex === index ? (
                  <HapticCard
                    key={item.name}
                    className="mx-auto max-w-2xl border-zinc-700 bg-zinc-900/90 text-zinc-100 animate-fade-in"
                  >
                    <CardContent className="flex flex-col items-center pt-8">
                      <img
                        src={item.image ?? userAvatar}
                        alt={`${item.name} testimonial portrait`}
                        className="h-20 w-20 rounded-full object-cover ring-2 ring-primary/60"
                        loading="lazy"
                      />
                      <p className="mt-6 whitespace-pre-line text-left text-base text-zinc-200">
                        "{item.quote}"
                      </p>
                      <p className="mt-4 font-semibold text-zinc-100">- {item.name}</p>
                    </CardContent>
                  </HapticCard>
                ) : null,
              )}
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {testimonials.map((item, index) => (
                <button
                  key={`${item.name}-dot`}
                  type="button"
                  aria-label={`Show testimonial from ${item.name}`}
                  onClick={() => setActiveTestimonialIndex(index)}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-all",
                    activeTestimonialIndex === index ? "bg-primary" : "bg-zinc-600",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="bg-background py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold md:text-4xl">FAQs</h2>
          <HapticCard className="mt-6">
            <CardContent className="pt-4">
              <Accordion type="single" collapsible>
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </HapticCard>
        </div>
      </RevealSection>

      <RevealSection className="bg-background pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <HapticCard className="border-primary/30 bg-primary/10">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold md:text-5xl">
                You do not need more tutorials. You need structure that makes you ship.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Cohort starts April 1. Slots are limited because the program is cohort-based.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="group">
                  <a href={SELAR_REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
                    Register NOW!
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#current-cohort">View cohort progress</a>
                </Button>
              </div>
            </CardContent>
          </HapticCard>
        </div>
      </RevealSection>
    </div>
  );
};

export default AIMT;
