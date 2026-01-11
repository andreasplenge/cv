import { useState, useEffect, useRef } from "react";
import { Linkedin, Mail, MapPin, Github, Plus, Minus, ExternalLink, ChevronUp, ChevronDown, Star } from "lucide-react";
import GeometricBackground from "@/components/GeometricBackground";
import { EditableCoursework } from "@/components/EditableCoursework";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  useCVGeneralInfo,
  useCVTechnicalDomains,
  useCVExperience,
  useCVSelectedWork,
  useCVEducation,
  useCVPublications,
  CVGeneralInfo,
  CVTechnicalDomain,
  CVExperience,
  CVSelectedWork,
  CVEducation,
  CVPublication,
  TechnicalDomainType,
  getAllSkills,
} from "@/hooks/use-cv-data";

// Editable text component with auto-save
const EditableText = ({
  value,
  onSave,
  className = "",
  placeholder = "Click to edit...",
  multiline = false,
}: {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleBlur = () => {
    setEditing(false);
    if (text !== value) {
      onSave(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleBlur();
    }
    if (e.key === "Escape") {
      setText(value);
      setEditing(false);
    }
  };

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`bg-transparent border-b border-primary outline-none w-full resize-none min-h-[100px] ${className}`}
          placeholder={placeholder}
        />
      );
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`bg-transparent border-b border-primary outline-none w-full ${className}`}
        placeholder={placeholder}
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className={`cursor-pointer hover:bg-accent/20 px-1 -mx-1 rounded transition-colors ${!text ? "text-muted-foreground/50 italic" : ""} ${className}`}
    >
      {text || placeholder}
    </span>
  );
};

// Editable array with suggestions from technical domains
const EditableArrayWithSuggestions = ({
  items,
  onSave,
  suggestions,
  placeholder = "Add item...",
}: {
  items: string[];
  onSave: (items: string[]) => void;
  suggestions: string[];
  placeholder?: string;
}) => {
  const [adding, setAdding] = useState(false);
  const availableSuggestions = suggestions.filter((s) => !items.includes(s));

  const addItem = (item: string) => {
    if (item.trim() && !items.includes(item.trim())) {
      onSave([...items, item.trim()]);
    }
    setAdding(false);
  };

  const removeItem = (index: number) => {
    onSave(items.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className="px-3 py-1 border border-border text-sm font-mono hover:border-primary transition-colors group flex items-center gap-2"
        >
          {item}
          <button
            onClick={() => removeItem(i)}
            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Minus className="w-3 h-3" />
          </button>
        </span>
      ))}
      {adding ? (
        <select
          autoFocus
          onChange={(e) => {
            if (e.target.value) addItem(e.target.value);
          }}
          onBlur={() => setAdding(false)}
          className="px-3 py-1 border border-primary text-sm font-mono bg-background outline-none cursor-pointer"
          defaultValue=""
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {availableSuggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion}>
              {suggestion}
            </option>
          ))}
        </select>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="px-3 py-1 border border-dashed border-border text-sm font-mono text-muted-foreground hover:border-primary hover:text-foreground transition-colors flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

// Technical Domain Item component for editing individual skills
const TechnicalDomainItem = ({
  domain,
  onToggleHighlight,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  domain: CVTechnicalDomain;
  onToggleHighlight: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) => (
  <span
    className={`px-3 py-1 border text-sm font-mono transition-colors group flex items-center gap-2 ${
      domain.is_highlighted ? "border-primary bg-primary/10" : "border-border hover:border-primary"
    }`}
  >
    <span className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={onMoveUp}
        disabled={isFirst}
        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
      >
        <ChevronUp className="w-3 h-3" />
      </button>
      <button
        onClick={onMoveDown}
        disabled={isLast}
        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
      >
        <ChevronDown className="w-3 h-3" />
      </button>
    </span>
    {domain.skill}
    <button
      onClick={onToggleHighlight}
      className={`transition-opacity ${domain.is_highlighted ? "text-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100"}`}
      title={domain.is_highlighted ? "Remove from CV highlights" : "Add to CV highlights"}
    >
      <Star className={`w-3 h-3 ${domain.is_highlighted ? "fill-current" : ""}`} />
    </button>
    <button
      onClick={onDelete}
      className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <Minus className="w-3 h-3" />
    </button>
  </span>
);

// Technical Domain Category component
const TechnicalDomainCategory = ({
  title,
  type,
  domains,
  onAdd,
  onToggleHighlight,
  onDelete,
  onReorder,
}: {
  title: string;
  type: TechnicalDomainType;
  domains: CVTechnicalDomain[];
  onAdd: (skill: string) => void;
  onToggleHighlight: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
}) => {
  const [adding, setAdding] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleAdd = () => {
    if (newSkill.trim()) {
      onAdd(newSkill.trim());
      setNewSkill("");
      setAdding(false);
    }
  };

  const sortedDomains = [...domains].sort((a, b) => a.order_index - b.order_index);

  return (
    <div>
      <h4 className="font-mono text-xs text-muted-foreground mb-4">// {title}</h4>
      <div className="flex flex-wrap gap-2">
        {sortedDomains.map((domain, idx) => (
          <TechnicalDomainItem
            key={domain.id}
            domain={domain}
            onToggleHighlight={() => onToggleHighlight(domain.id)}
            onDelete={() => onDelete(domain.id)}
            onMoveUp={() => onReorder(domain.id, "up")}
            onMoveDown={() => onReorder(domain.id, "down")}
            isFirst={idx === 0}
            isLast={idx === sortedDomains.length - 1}
          />
        ))}
        {adding ? (
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onBlur={() => {
              handleAdd();
              setAdding(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") {
                setNewSkill("");
                setAdding(false);
              }
            }}
            className="px-3 py-1 border border-primary text-sm font-mono bg-transparent outline-none w-32"
            placeholder={`Add ${type}...`}
            autoFocus
          />
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="px-3 py-1 border border-dashed border-border text-sm font-mono text-muted-foreground hover:border-primary hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

const CVEdit = () => {
  const queryClient = useQueryClient();
  const { data: generalInfo, isLoading: loadingInfo } = useCVGeneralInfo();
  const { data: technicalDomains, isLoading: loadingDomains } = useCVTechnicalDomains();
  const { data: experience, isLoading: loadingExperience } = useCVExperience();
  const { data: selectedWork, isLoading: loadingWork } = useCVSelectedWork();
  const { data: education, isLoading: loadingEducation } = useCVEducation();
  const { data: publications, isLoading: loadingPublications } = useCVPublications();

  const isLoading = loadingInfo || loadingDomains || loadingExperience || loadingWork || loadingEducation || loadingPublications;

  // General Info handlers
  const updateGeneralInfo = async (field: keyof CVGeneralInfo, value: string) => {
    if (generalInfo) {
      const { error } = await supabase
        .from("cv_general_info")
        .update({ [field]: value, last_compiled: new Date().toISOString() })
        .eq("id", generalInfo.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        queryClient.invalidateQueries({ queryKey: ["cv-general-info"] });
      }
    } else {
      const { error } = await supabase
        .from("cv_general_info")
        .insert({ [field]: value });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        queryClient.invalidateQueries({ queryKey: ["cv-general-info"] });
      }
    }
  };

  // Technical Domains handlers (new normalized structure)
  const addTechnicalDomain = async (type: TechnicalDomainType, skill: string) => {
    const domainsOfType = technicalDomains?.filter(d => d.type === type) || [];
    const maxOrder = domainsOfType.reduce((max, d) => Math.max(max, d.order_index), -1);
    
    const { error } = await supabase
      .from("cv_technical_domains")
      .insert({ type, skill, order_index: maxOrder + 1, is_highlighted: false });
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-technical-domains"] });
    }
  };

  const toggleDomainHighlight = async (id: string) => {
    const domain = technicalDomains?.find(d => d.id === id);
    if (!domain) return;

    const { error } = await supabase
      .from("cv_technical_domains")
      .update({ is_highlighted: !domain.is_highlighted })
      .eq("id", id);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-technical-domains"] });
    }
  };

  const deleteTechnicalDomain = async (id: string) => {
    const { error } = await supabase.from("cv_technical_domains").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-technical-domains"] });
    }
  };

  const reorderTechnicalDomain = async (id: string, direction: "up" | "down") => {
    const domain = technicalDomains?.find(d => d.id === id);
    if (!domain) return;

    const domainsOfType = technicalDomains?.filter(d => d.type === domain.type).sort((a, b) => a.order_index - b.order_index) || [];
    const currentIndex = domainsOfType.findIndex(d => d.id === id);
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    
    if (swapIndex < 0 || swapIndex >= domainsOfType.length) return;

    const current = domainsOfType[currentIndex];
    const swap = domainsOfType[swapIndex];

    await supabase.from("cv_technical_domains").update({ order_index: swap.order_index }).eq("id", current.id);
    await supabase.from("cv_technical_domains").update({ order_index: current.order_index }).eq("id", swap.id);
    queryClient.invalidateQueries({ queryKey: ["cv-technical-domains"] });
  };

  // Experience handlers
  const addExperience = async () => {
    const maxOrder = experience?.reduce((max, e) => Math.max(max, e.order_index), -1) ?? -1;
    const { error } = await supabase
      .from("cv_experience")
      .insert({ company: "Company", role: "Role", period: "2024 → Present", order_index: maxOrder + 1 });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-experience"] });
    }
  };

  const updateExperience = async (id: string, field: keyof CVExperience, value: string) => {
    const { error } = await supabase
      .from("cv_experience")
      .update({ [field]: value })
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-experience"] });
    }
  };

  const deleteExperience = async (id: string) => {
    const { error } = await supabase.from("cv_experience").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-experience"] });
    }
  };

  // Selected Work handlers
  const addSelectedWork = async () => {
    const maxOrder = selectedWork?.reduce((max, w) => Math.max(max, w.order_index), -1) ?? -1;
    const slug = `project-${Date.now()}`;
    const { error } = await supabase
      .from("cv_selected_work")
      .insert({ title: "New Project", slug, order_index: maxOrder + 1 });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-selected-work"] });
    }
  };

  const updateSelectedWork = async (id: string, field: keyof CVSelectedWork, value: string | string[]) => {
    const { error } = await supabase
      .from("cv_selected_work")
      .update({ [field]: value })
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-selected-work"] });
    }
  };

  const deleteSelectedWork = async (id: string) => {
    const { error } = await supabase.from("cv_selected_work").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-selected-work"] });
    }
  };

  const reorderSelectedWork = async (id: string, direction: "up" | "down") => {
    if (!selectedWork) return;
    const sorted = [...selectedWork].sort((a, b) => a.order_index - b.order_index);
    const currentIndex = sorted.findIndex((w) => w.id === id);
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;
    
    const current = sorted[currentIndex];
    const swap = sorted[swapIndex];
    
    await supabase.from("cv_selected_work").update({ order_index: swap.order_index }).eq("id", current.id);
    await supabase.from("cv_selected_work").update({ order_index: current.order_index }).eq("id", swap.id);
    queryClient.invalidateQueries({ queryKey: ["cv-selected-work"] });
  };

  // Education handlers
  const addEducation = async () => {
    const maxOrder = education?.reduce((max, e) => Math.max(max, e.order_index), -1) ?? -1;
    const { error } = await supabase
      .from("cv_education")
      .insert({ institution: "Institution", degree: "Degree", year: new Date().getFullYear(), order_index: maxOrder + 1 });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-education"] });
    }
  };

  const updateEducation = async (id: string, field: keyof CVEducation, value: string | number) => {
    const { error } = await supabase
      .from("cv_education")
      .update({ [field]: value })
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-education"] });
    }
  };

  const deleteEducation = async (id: string) => {
    const { error } = await supabase.from("cv_education").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-education"] });
    }
  };

  const reorderEducation = async (id: string, direction: "up" | "down") => {
    if (!education) return;
    const sorted = [...education].sort((a, b) => a.order_index - b.order_index);
    const currentIndex = sorted.findIndex((e) => e.id === id);
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;
    
    const current = sorted[currentIndex];
    const swap = sorted[swapIndex];
    
    await supabase.from("cv_education").update({ order_index: swap.order_index }).eq("id", current.id);
    await supabase.from("cv_education").update({ order_index: current.order_index }).eq("id", swap.id);
    queryClient.invalidateQueries({ queryKey: ["cv-education"] });
  };

  // Publications handlers
  const addPublication = async () => {
    const maxOrder = publications?.reduce((max, p) => Math.max(max, p.order_index), -1) ?? -1;
    const { error } = await supabase
      .from("cv_publications")
      .insert({ title: "New Publication", order_index: maxOrder + 1 });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-publications"] });
    }
  };

  const updatePublication = async (id: string, field: keyof CVPublication, value: string | number | null) => {
    const { error } = await supabase
      .from("cv_publications")
      .update({ [field]: value })
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-publications"] });
    }
  };

  const deletePublication = async (id: string) => {
    const { error } = await supabase.from("cv_publications").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-publications"] });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground">// Loading...</p>
      </div>
    );
  }

  const lastCompiled = generalInfo?.last_compiled 
    ? new Date(generalInfo.last_compiled).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  // Group technical domains by type
  const domainsByType = {
    language: technicalDomains?.filter(d => d.type === 'language') || [],
    domain: technicalDomains?.filter(d => d.type === 'domain') || [],
    theory: technicalDomains?.filter(d => d.type === 'theory') || [],
    tool: technicalDomains?.filter(d => d.type === 'tool') || [],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Edit mode indicator */}
      <div className="fixed top-4 right-4 z-50 px-3 py-1 bg-primary text-primary-foreground text-xs font-mono rounded">
        EDIT MODE
      </div>

      <GeometricBackground />

      <main className="relative max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <p className="font-mono text-xs text-muted-foreground tracking-widest mb-2">
                // CURRICULUM VITAE
              </p>
              <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-3">
                Andreas Plenge
              </h1>
              <p className="text-lg text-muted-foreground font-light">
                <EditableText
                  value={generalInfo?.title || ""}
                  onSave={(v) => updateGeneralInfo("title", v)}
                  placeholder="Your Title"
                />
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <EditableText
                  value={generalInfo?.email || ""}
                  onSave={(v) => updateGeneralInfo("email", v)}
                  placeholder="email@example.com"
                  className="font-mono"
                />
              </div>
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                <EditableText
                  value={generalInfo?.linkedin || ""}
                  onSave={(v) => updateGeneralInfo("linkedin", v)}
                  placeholder="linkedin.com/in/username"
                  className="font-mono"
                />
              </div>
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                <EditableText
                  value={generalInfo?.github || ""}
                  onSave={(v) => updateGeneralInfo("github", v)}
                  placeholder="github.com/username"
                  className="font-mono"
                />
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <EditableText
                  value={generalInfo?.location || ""}
                  onSave={(v) => updateGeneralInfo("location", v)}
                  placeholder="City, Country"
                  className="font-mono"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Summary */}
        <Section title="Summary" index="01">
          <EditableText
            value={generalInfo?.summary || ""}
            onSave={(v) => updateGeneralInfo("summary", v)}
            placeholder="Write your professional summary here..."
            multiline
            className="text-muted-foreground leading-relaxed max-w-2xl block whitespace-pre-line"
          />
        </Section>

        {/* Technical Domain */}
        <Section title="Technical Domain" index="02">
          <p className="text-xs text-muted-foreground mb-4">
            Click the <Star className="w-3 h-3 inline" /> icon to highlight skills on the main CV page
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <TechnicalDomainCategory
              title="LANGUAGES"
              type="language"
              domains={domainsByType.language}
              onAdd={(skill) => addTechnicalDomain('language', skill)}
              onToggleHighlight={toggleDomainHighlight}
              onDelete={deleteTechnicalDomain}
              onReorder={reorderTechnicalDomain}
            />
            <TechnicalDomainCategory
              title="DOMAINS"
              type="domain"
              domains={domainsByType.domain}
              onAdd={(skill) => addTechnicalDomain('domain', skill)}
              onToggleHighlight={toggleDomainHighlight}
              onDelete={deleteTechnicalDomain}
              onReorder={reorderTechnicalDomain}
            />
            <TechnicalDomainCategory
              title="THEORY"
              type="theory"
              domains={domainsByType.theory}
              onAdd={(skill) => addTechnicalDomain('theory', skill)}
              onToggleHighlight={toggleDomainHighlight}
              onDelete={deleteTechnicalDomain}
              onReorder={reorderTechnicalDomain}
            />
            <TechnicalDomainCategory
              title="TOOLS"
              type="tool"
              domains={domainsByType.tool}
              onAdd={(skill) => addTechnicalDomain('tool', skill)}
              onToggleHighlight={toggleDomainHighlight}
              onDelete={deleteTechnicalDomain}
              onReorder={reorderTechnicalDomain}
            />
          </div>
        </Section>

        {/* Experience */}
        <Section title="Experience" index="03" onAdd={addExperience}>
          <div className="space-y-10">
            {(experience || []).map((exp) => (
              <div key={exp.id} className="group relative">
                <button
                  onClick={() => deleteExperience(exp.id)}
                  className="absolute -left-8 top-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                  <div>
                    <h4 className="font-medium">
                      <EditableText
                        value={exp.role}
                        onSave={(v) => updateExperience(exp.id, "role", v)}
                        placeholder="Role"
                      />
                    </h4>
                    <p className="text-muted-foreground">
                      <EditableText
                        value={exp.company}
                        onSave={(v) => updateExperience(exp.id, "company", v)}
                        placeholder="Company"
                      />
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm text-muted-foreground block">
                      <EditableText
                        value={exp.period}
                        onSave={(v) => updateExperience(exp.id, "period", v)}
                        placeholder="2024 → Present"
                      />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      <EditableText
                        value={exp.location || ""}
                        onSave={(v) => updateExperience(exp.id, "location", v)}
                        placeholder="Location"
                      />
                    </span>
                  </div>
                </div>
                <EditableText
                  value={exp.description || ""}
                  onSave={(v) => updateExperience(exp.id, "description", v)}
                  placeholder="Short description..."
                  multiline
                  className="text-sm text-muted-foreground block whitespace-pre-line mb-3"
                />
                <div>
                  <p className="font-mono text-xs text-muted-foreground mb-1">// FULL DESCRIPTION (experience page)</p>
                  <EditableText
                    value={(exp as any).full_description || ""}
                    onSave={(v) => updateExperience(exp.id, "full_description" as any, v)}
                    placeholder="Detailed overview for the experience page..."
                    multiline
                    className="text-xs text-muted-foreground block"
                  />
                </div>
              </div>
            ))}
            {(!experience || experience.length === 0) && (
              <p className="text-muted-foreground/50 italic text-sm">No experience added yet. Click + to add.</p>
            )}
          </div>
        </Section>

        {/* Selected Work */}
        <Section title="Selected Work" index="04" onAdd={addSelectedWork}>
          <div className="grid md:grid-cols-2 gap-6">
          {(selectedWork || []).map((project, idx) => (
              <div
                key={project.id}
                className="group relative p-5 border border-border hover:border-primary transition-all duration-300"
              >
                <div className="absolute -left-3 -top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background rounded-full">
                  <button
                    onClick={() => deleteSelectedWork(project.id)}
                    className="text-muted-foreground hover:text-destructive p-1"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => reorderSelectedWork(project.id, "up")}
                    disabled={idx === 0}
                    className="text-muted-foreground hover:text-foreground p-1 disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => reorderSelectedWork(project.id, "down")}
                    disabled={idx === (selectedWork?.length || 0) - 1}
                    className="text-muted-foreground hover:text-foreground p-1 disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-mono font-medium">
                    <EditableText
                      value={project.title}
                      onSave={(v) => updateSelectedWork(project.id, "title", v)}
                      placeholder="Project Title"
                    />
                  </h4>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="mb-2">
                  <EditableText
                    value={project.slug || ""}
                    onSave={(v) => updateSelectedWork(project.id, "slug", v)}
                    placeholder="project-slug"
                    className="text-xs font-mono text-muted-foreground"
                  />
                </div>
                <EditableText
                  value={project.description || ""}
                  onSave={(v) => updateSelectedWork(project.id, "description", v)}
                  placeholder="Short description..."
                  className="text-sm text-muted-foreground block mb-3"
                />
                <div className="mb-3">
                  <p className="font-mono text-xs text-muted-foreground mb-1">// FULL DESCRIPTION (project page)</p>
                  <EditableText
                    value={project.full_description || ""}
                    onSave={(v) => updateSelectedWork(project.id, "full_description", v)}
                    placeholder="Detailed description for the project page..."
                    multiline
                    className="text-xs text-muted-foreground block"
                  />
                </div>
                <div className="mb-3">
                  <p className="font-mono text-xs text-muted-foreground mb-1">// VISIBILITY</p>
                  <select
                    value={project.visibility || "selected_work"}
                    onChange={(e) => updateSelectedWork(project.id, "visibility", e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-transparent border border-border rounded hover:border-primary transition-colors cursor-pointer"
                  >
                    <option value="selected_work">Selected Work (CV + Work Page)</option>
                    <option value="work_page_project">Work Page Project (Work Page only)</option>
                    <option value="personal_document">Personal Document (Hidden)</option>
                  </select>
                </div>
                <div className="mb-3">
                  <p className="font-mono text-xs text-muted-foreground mb-1">// RELATED TO (optional)</p>
                  <select
                    value={
                      project.related_experience_id 
                        ? `exp:${project.related_experience_id}` 
                        : project.related_education_id 
                          ? `edu:${project.related_education_id}` 
                          : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!value) {
                        updateSelectedWork(project.id, "related_experience_id", null as any);
                        updateSelectedWork(project.id, "related_education_id", null as any);
                      } else if (value.startsWith("exp:")) {
                        updateSelectedWork(project.id, "related_education_id", null as any);
                        updateSelectedWork(project.id, "related_experience_id", value.replace("exp:", "") as any);
                      } else if (value.startsWith("edu:")) {
                        updateSelectedWork(project.id, "related_experience_id", null as any);
                        updateSelectedWork(project.id, "related_education_id", value.replace("edu:", "") as any);
                      }
                    }}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-transparent border border-border rounded hover:border-primary transition-colors cursor-pointer"
                  >
                    <option value="">None</option>
                    {experience && experience.length > 0 && (
                      <optgroup label="Experience">
                        {experience.map((exp) => (
                          <option key={exp.id} value={`exp:${exp.id}`}>
                            {exp.role} @ {exp.company}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {education && education.length > 0 && (
                      <optgroup label="Education">
                        {education.map((edu) => (
                          <option key={edu.id} value={`edu:${edu.id}`}>
                            {edu.degree} @ {edu.institution}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
                <EditableArrayWithSuggestions
                  items={project.tags || []}
                  onSave={(items) => updateSelectedWork(project.id, "tags", items)}
                  suggestions={technicalDomains ? getAllSkills(technicalDomains) : []}
                  placeholder="Select tag..."
                />
              </div>
            ))}
            {(!selectedWork || selectedWork.length === 0) && (
              <p className="text-muted-foreground/50 italic text-sm col-span-2">No projects added yet. Click + to add.</p>
            )}
          </div>
        </Section>

        {/* Education */}
        <Section title="Education" index="05" onAdd={addEducation}>
          <div className="space-y-6">
            {(education || []).map((edu, idx) => (
              <div key={edu.id} className="group relative">
                <div className="absolute -left-8 top-0 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => deleteEducation(edu.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => reorderEducation(edu.id, "up")}
                    disabled={idx === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => reorderEducation(edu.id, "down")}
                    disabled={idx === (education?.length || 0) - 1}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                  <div>
                    <h4 className="font-medium">
                      <EditableText
                        value={edu.degree}
                        onSave={(v) => updateEducation(edu.id, "degree", v)}
                        placeholder="Degree"
                      />
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      <EditableText
                        value={edu.institution}
                        onSave={(v) => updateEducation(edu.id, "institution", v)}
                        placeholder="Institution"
                      />
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm text-muted-foreground block">
                      <EditableText
                        value={edu.year.toString()}
                        onSave={(v) => updateEducation(edu.id, "year", parseInt(v) || edu.year)}
                        placeholder="Year"
                      />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      <EditableText
                        value={(edu as any).location || ""}
                        onSave={(v) => updateEducation(edu.id, "location" as any, v)}
                        placeholder="Location"
                      />
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  <EditableText
                    value={edu.thesis || ""}
                    onSave={(v) => updateEducation(edu.id, "thesis", v)}
                    placeholder="Thesis title (optional)"
                  />
                  {" | "}
                  <EditableText
                    value={edu.honours || ""}
                    onSave={(v) => updateEducation(edu.id, "honours", v)}
                    placeholder="Honours (optional)"
                  />
                </p>
                <div className="mb-3">
                  <p className="font-mono text-xs text-muted-foreground mb-1">// FULL DESCRIPTION (education page)</p>
                  <EditableText
                    value={(edu as any).full_description || ""}
                    onSave={(v) => updateEducation(edu.id, "full_description" as any, v)}
                    placeholder="Detailed overview for the education page..."
                    multiline
                    className="text-xs text-muted-foreground block"
                  />
                </div>
                <div>
                  <p className="font-mono text-xs text-muted-foreground mb-1">// COURSEWORK (with technical domain links)</p>
                  <EditableCoursework
                    educationId={edu.id}
                    technicalDomains={technicalDomains || null}
                  />
                </div>
              </div>
            ))}
            {(!education || education.length === 0) && (
              <p className="text-muted-foreground/50 italic text-sm">No education added yet. Click + to add.</p>
            )}
          </div>
        </Section>

        {/* Publications */}
        <Section title="Publications" index="06" onAdd={addPublication}>
          <div className="space-y-4">
            {(publications || []).map((pub) => (
              <div key={pub.id} className="group relative">
                <button
                  onClick={() => deletePublication(pub.id)}
                  className="absolute -left-8 top-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <p className="text-sm">
                  <span className="text-muted-foreground">
                    <EditableText
                      value={pub.authors || ""}
                      onSave={(v) => updatePublication(pub.id, "authors", v)}
                      placeholder="Authors"
                    />
                  </span>{" "}
                  "<EditableText
                    value={pub.title}
                    onSave={(v) => updatePublication(pub.id, "title", v)}
                    placeholder="Publication Title"
                  />"
                </p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  <EditableText
                    value={pub.venue || ""}
                    onSave={(v) => updatePublication(pub.id, "venue", v)}
                    placeholder="Venue"
                  />
                  {" · "}
                  <EditableText
                    value={pub.year?.toString() || ""}
                    onSave={(v) => updatePublication(pub.id, "year", parseInt(v) || null)}
                    placeholder="Year"
                  />
                </p>
              </div>
            ))}
            {(!publications || publications.length === 0) && (
              <p className="text-muted-foreground/50 italic text-sm">No publications added yet. Click + to add.</p>
            )}
          </div>
        </Section>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-border">
          <p className="font-mono text-xs text-muted-foreground text-center">
            Last updated {lastCompiled}
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
  onAdd
}: { 
  title: string; 
  index: string; 
  children: React.ReactNode;
  onAdd?: () => void;
}) => (
  <section className="mb-16">
    <div className="flex items-baseline gap-4 mb-6">
      <span className="font-mono text-xs text-muted-foreground">{index}</span>
      <h2 className="text-xl font-light tracking-wide">{title}</h2>
      <div className="flex-1 h-px bg-border" />
      {onAdd && (
        <button
          onClick={onAdd}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}
    </div>
    {children}
  </section>
);

export default CVEdit;
