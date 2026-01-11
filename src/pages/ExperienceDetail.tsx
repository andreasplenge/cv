import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, MapPin, Calendar } from "lucide-react";
import GeometricBackground from "@/components/GeometricBackground";
import { useCVExperienceById, useCVTechnicalDomains, getSkillsByType } from "@/hooks/use-cv-data";

const ExperienceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: experience, isLoading } = useCVExperienceById(id);
  const { data: technicalDomains } = useCVTechnicalDomains();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground">// Loading...</p>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-sm text-muted-foreground mb-4">// Experience not found</p>
          <Link to="/" className="text-primary hover:underline">
            ← Back to CV
          </Link>
        </div>
      </div>
    );
  }

  // Collect all unique tags from related projects
  const allTags = experience.related_projects.flatMap((p) => p.tags || []);
  const uniqueTags = [...new Set(allTags)];

  // Get all skills by type from technical domains
  const languages = technicalDomains ? getSkillsByType(technicalDomains, 'language') : [];
  const domains = technicalDomains ? getSkillsByType(technicalDomains, 'domain') : [];
  const theory = technicalDomains ? getSkillsByType(technicalDomains, 'theory') : [];
  const tools = technicalDomains ? getSkillsByType(technicalDomains, 'tool') : [];

  const categorizedTags = {
    languages: uniqueTags.filter((t) => languages.includes(t)),
    domains: uniqueTags.filter((t) => domains.includes(t)),
    theory: uniqueTags.filter((t) => theory.includes(t)),
    tools: uniqueTags.filter((t) => tools.includes(t)),
    other: uniqueTags.filter(
      (t) => !languages.includes(t) && !domains.includes(t) && !theory.includes(t) && !tools.includes(t)
    ),
  };

  const hasCategories =
    categorizedTags.languages.length > 0 ||
    categorizedTags.domains.length > 0 ||
    categorizedTags.theory.length > 0 ||
    categorizedTags.tools.length > 0 ||
    categorizedTags.other.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GeometricBackground />

      <main className="relative max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CV
        </Link>

        {/* Header */}
        <header className="mb-12">
          <p className="font-mono text-xs text-muted-foreground tracking-widest mb-2">
            EXPERIENCE
          </p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
            {experience.role}
          </h1>
          <p className="text-xl text-muted-foreground font-light mb-2">
            {experience.company}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="font-mono">{experience.period}</span>
            </div>
            {experience.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="font-mono">{experience.location}</span>
              </div>
            )}
          </div>
          {experience.description && (
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              {experience.description}
            </p>
          )}
        </header>

        {/* Overview (full_description) */}
        {experience.full_description && (
          <Section title="Overview" index="01">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {experience.full_description}
            </p>
          </Section>
        )}

        {/* Technical Stack from related projects */}
        {hasCategories && (
          <Section title="Technical Stack" index={experience.full_description ? "02" : "01"}>
            <div className="grid md:grid-cols-2 gap-8">
              {categorizedTags.languages.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs text-muted-foreground mb-4">LANGUAGES</h4>
                  <div className="flex flex-wrap gap-2">
                    {categorizedTags.languages.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 border border-border text-sm font-mono hover:border-primary transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {categorizedTags.domains.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs text-muted-foreground mb-4">DOMAINS</h4>
                  <div className="flex flex-wrap gap-2">
                    {categorizedTags.domains.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 border border-border text-sm font-mono hover:border-primary transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {categorizedTags.theory.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs text-muted-foreground mb-4">THEORY</h4>
                  <div className="flex flex-wrap gap-2">
                    {categorizedTags.theory.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 border border-border text-sm font-mono hover:border-primary transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {categorizedTags.tools.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs text-muted-foreground mb-4">TOOLS</h4>
                  <div className="flex flex-wrap gap-2">
                    {categorizedTags.tools.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 border border-border text-sm font-mono hover:border-primary transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {categorizedTags.other.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs text-muted-foreground mb-4">OTHER</h4>
                  <div className="flex flex-wrap gap-2">
                    {categorizedTags.other.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 border border-border text-sm font-mono hover:border-primary transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Related Projects */}
        {experience.related_projects.length > 0 && (
          <Section title="Projects" index={
            (experience.full_description ? 1 : 0) + (hasCategories ? 1 : 0) + 1 < 10 
              ? `0${(experience.full_description ? 1 : 0) + (hasCategories ? 1 : 0) + 1}` 
              : `${(experience.full_description ? 1 : 0) + (hasCategories ? 1 : 0) + 1}`
          }>
            <div className="grid md:grid-cols-2 gap-6">
              {experience.related_projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/project/${project.slug || project.id}`}
                  className="group block p-5 border border-border hover:border-primary transition-all duration-300 hover:bg-accent/5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-mono font-medium group-hover:text-primary transition-colors">
                      {project.title}
                    </h4>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-xs font-mono text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-border">
          <p className="font-mono text-xs text-muted-foreground text-center">
            <Link to="/" className="hover:text-foreground transition-colors">
              ← Back to CV
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
};

const Section = ({
  title,
  index,
  children,
}: {
  title: string;
  index: string;
  children: React.ReactNode;
}) => (
  <section className="mb-16">
    <div className="flex items-baseline gap-4 mb-6">
      <span className="font-mono text-xs text-muted-foreground">{index}</span>
      <h2 className="text-xl font-light tracking-wide">{title}</h2>
      <div className="flex-1 h-px bg-border" />
    </div>
    {children}
  </section>
);

export default ExperienceDetail;
