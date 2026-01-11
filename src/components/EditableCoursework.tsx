import { useState } from "react";
import { Plus, Minus, ChevronUp, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { CVTechnicalDomain, CVCoursework } from "@/hooks/use-cv-data";

interface EditableCourseworkProps {
  educationId: string;
  technicalDomains: CVTechnicalDomain[] | null;
}

export const EditableCoursework = ({ educationId, technicalDomains }: EditableCourseworkProps) => {
  const queryClient = useQueryClient();
  const [newItem, setNewItem] = useState("");
  const [adding, setAdding] = useState(false);

  const { data: coursework = [] } = useQuery({
    queryKey: ["cv-coursework", educationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cv_coursework")
        .select("*")
        .eq("education_id", educationId)
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      return data as CVCoursework[];
    },
  });

  const addCoursework = async () => {
    if (!newItem.trim()) return;
    
    const maxOrder = coursework.reduce((max, c) => Math.max(max, c.order_index), -1);
    const { error } = await supabase
      .from("cv_coursework")
      .insert({ 
        education_id: educationId, 
        name: newItem.trim(), 
        order_index: maxOrder + 1 
      });
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-coursework", educationId] });
      setNewItem("");
      setAdding(false);
    }
  };

  const removeCoursework = async (id: string) => {
    const { error } = await supabase.from("cv_coursework").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-coursework", educationId] });
    }
  };

  const updateCoursework = async (id: string, field: keyof CVCoursework, value: string | null) => {
    const { error } = await supabase
      .from("cv_coursework")
      .update({ [field]: value })
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["cv-coursework", educationId] });
    }
  };

  const moveItem = async (id: string, direction: "up" | "down") => {
    const sorted = [...coursework].sort((a, b) => a.order_index - b.order_index);
    const currentIndex = sorted.findIndex((c) => c.id === id);
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;
    
    const current = sorted[currentIndex];
    const swap = sorted[swapIndex];
    
    await supabase.from("cv_coursework").update({ order_index: swap.order_index }).eq("id", current.id);
    await supabase.from("cv_coursework").update({ order_index: current.order_index }).eq("id", swap.id);
    queryClient.invalidateQueries({ queryKey: ["cv-coursework", educationId] });
  };

  // Group technical domains by type
  const domainsByType = {
    language: technicalDomains?.filter(d => d.type === 'language') || [],
    domain: technicalDomains?.filter(d => d.type === 'domain') || [],
    theory: technicalDomains?.filter(d => d.type === 'theory') || [],
    tool: technicalDomains?.filter(d => d.type === 'tool') || [],
  };

  const getDomainLabel = (type: string | null) => {
    switch (type) {
      case 'language': return 'Lang';
      case 'domain': return 'Dom';
      case 'theory': return 'Theory';
      case 'tool': return 'Tool';
      default: return null;
    }
  };

  return (
    <div className="space-y-2">
      {coursework.map((course, i) => (
        <div
          key={course.id}
          className="flex items-center gap-2 p-2 border border-border hover:border-primary transition-colors group"
        >
          <span className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => moveItem(course.id, "up")}
              disabled={i === 0}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => moveItem(course.id, "down")}
              disabled={i === coursework.length - 1}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </span>
          
          <span className="flex-1 font-mono text-sm">{course.name}</span>
          
          <select
            value={course.technical_domain_item ? `${course.technical_domain}:${course.technical_domain_item}` : ""}
            onChange={(e) => {
              const value = e.target.value;
              if (!value) {
                updateCoursework(course.id, "technical_domain", null);
                updateCoursework(course.id, "technical_domain_item", null);
              } else {
                const [type, item] = value.split(":");
                updateCoursework(course.id, "technical_domain", type);
                updateCoursework(course.id, "technical_domain_item", item);
              }
            }}
            className="px-2 py-1 text-xs font-mono bg-transparent border border-border rounded hover:border-primary transition-colors cursor-pointer max-w-[150px]"
          >
            <option value="">No domain</option>
            {domainsByType.language.length > 0 && (
              <optgroup label="Languages">
                {domainsByType.language.map((d) => (
                  <option key={`language:${d.skill}`} value={`language:${d.skill}`}>
                    {d.skill}
                  </option>
                ))}
              </optgroup>
            )}
            {domainsByType.domain.length > 0 && (
              <optgroup label="Domains">
                {domainsByType.domain.map((d) => (
                  <option key={`domain:${d.skill}`} value={`domain:${d.skill}`}>
                    {d.skill}
                  </option>
                ))}
              </optgroup>
            )}
            {domainsByType.theory.length > 0 && (
              <optgroup label="Theory">
                {domainsByType.theory.map((d) => (
                  <option key={`theory:${d.skill}`} value={`theory:${d.skill}`}>
                    {d.skill}
                  </option>
                ))}
              </optgroup>
            )}
            {domainsByType.tool.length > 0 && (
              <optgroup label="Tools">
                {domainsByType.tool.map((d) => (
                  <option key={`tool:${d.skill}`} value={`tool:${d.skill}`}>
                    {d.skill}
                  </option>
                ))}
              </optgroup>
            )}
          </select>

          {course.technical_domain_item && (
            <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs font-mono rounded">
              {getDomainLabel(course.technical_domain)}
            </span>
          )}
          
          <button
            onClick={() => removeCoursework(course.id)}
            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Minus className="w-3 h-3" />
          </button>
        </div>
      ))}
      
      {adding ? (
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onBlur={() => {
            addCoursework();
            setAdding(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") addCoursework();
            if (e.key === "Escape") {
              setNewItem("");
              setAdding(false);
            }
          }}
          className="w-full px-3 py-2 border border-primary text-sm font-mono bg-transparent outline-none"
          placeholder="Course name..."
          autoFocus
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full px-3 py-2 border border-dashed border-border text-sm font-mono text-muted-foreground hover:border-primary hover:text-foreground transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add course
        </button>
      )}
    </div>
  );
};
