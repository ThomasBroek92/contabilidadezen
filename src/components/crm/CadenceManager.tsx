import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical, Phone, Mail, MessageSquare, Calendar, Settings, CheckCircle } from "lucide-react";

interface CadenceStep {
  id?: string;
  cadence_id?: string;
  day_offset: number;
  task_title: string;
  task_description: string;
  task_type: string;
  priority: string;
}

interface CadenceTemplate {
  id: string;
  name: string;
  is_active: boolean;
  is_default: boolean;
  steps?: CadenceStep[];
}

const taskTypeConfig = {
  chamada: { icon: Phone, label: "Ligação", color: "bg-blue-500" },
  email: { icon: Mail, label: "E-mail", color: "bg-purple-500" },
  whatsapp: { icon: MessageSquare, label: "WhatsApp", color: "bg-green-500" },
  reuniao: { icon: Calendar, label: "Reunião", color: "bg-orange-500" },
};

const priorityConfig = {
  baixa: { label: "Baixa", variant: "outline" as const },
  media: { label: "Média", variant: "secondary" as const },
  alta: { label: "Alta", variant: "destructive" as const },
};

export function CadenceManager() {
  const [cadences, setCadences] = useState<CadenceTemplate[]>([]);
  const [selectedCadence, setSelectedCadence] = useState<CadenceTemplate | null>(null);
  const [steps, setSteps] = useState<CadenceStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCadences();
  }, []);

  async function fetchCadences() {
    try {
      const { data: cadencesData, error: cadencesError } = await supabase
        .from("cadence_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (cadencesError) throw cadencesError;
      setCadences(cadencesData || []);

      // Auto-select default or first cadence
      const defaultCadence = cadencesData?.find(c => c.is_default) || cadencesData?.[0];
      if (defaultCadence) {
        await selectCadence(defaultCadence);
      }
    } catch (error) {
      console.error("Error fetching cadences:", error);
      toast.error("Erro ao carregar cadências");
    } finally {
      setLoading(false);
    }
  }

  async function selectCadence(cadence: CadenceTemplate) {
    setSelectedCadence(cadence);
    
    const { data: stepsData, error } = await supabase
      .from("cadence_steps")
      .select("*")
      .eq("cadence_id", cadence.id)
      .order("day_offset", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar etapas");
      return;
    }

    setSteps(stepsData || []);
  }

  async function createCadence() {
    const { data, error } = await supabase
      .from("cadence_templates")
      .insert({ name: "Nova Cadência" })
      .select()
      .single();

    if (error) {
      toast.error("Erro ao criar cadência");
      return;
    }

    setCadences([data, ...cadences]);
    await selectCadence(data);
    toast.success("Cadência criada");
  }

  async function updateCadence(updates: Partial<CadenceTemplate>) {
    if (!selectedCadence) return;

    const { error } = await supabase
      .from("cadence_templates")
      .update(updates)
      .eq("id", selectedCadence.id);

    if (error) {
      toast.error("Erro ao atualizar cadência");
      return;
    }

    setSelectedCadence({ ...selectedCadence, ...updates });
    setCadences(cadences.map(c => 
      c.id === selectedCadence.id ? { ...c, ...updates } : c
    ));
  }

  async function setAsDefault() {
    if (!selectedCadence) return;

    // Remove default from all others
    await supabase
      .from("cadence_templates")
      .update({ is_default: false })
      .neq("id", selectedCadence.id);

    // Set this one as default
    await updateCadence({ is_default: true });
    
    setCadences(cadences.map(c => ({
      ...c,
      is_default: c.id === selectedCadence.id
    })));

    toast.success("Cadência definida como padrão");
  }

  async function deleteCadence() {
    if (!selectedCadence) return;

    const { error } = await supabase
      .from("cadence_templates")
      .delete()
      .eq("id", selectedCadence.id);

    if (error) {
      toast.error("Erro ao excluir cadência");
      return;
    }

    const remaining = cadences.filter(c => c.id !== selectedCadence.id);
    setCadences(remaining);
    
    if (remaining.length > 0) {
      await selectCadence(remaining[0]);
    } else {
      setSelectedCadence(null);
      setSteps([]);
    }

    toast.success("Cadência excluída");
  }

  function addStep() {
    const maxDay = steps.length > 0 ? Math.max(...steps.map(s => s.day_offset)) : -1;
    const newStep: CadenceStep = {
      day_offset: maxDay + 1,
      task_title: "Nova tarefa",
      task_description: "",
      task_type: "chamada",
      priority: "media",
    };
    setSteps([...steps, newStep]);
  }

  function updateStep(index: number, updates: Partial<CadenceStep>) {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    setSteps(newSteps);
  }

  function removeStep(index: number) {
    setSteps(steps.filter((_, i) => i !== index));
  }

  async function saveSteps() {
    if (!selectedCadence) return;
    setSaving(true);

    try {
      // Delete existing steps
      await supabase
        .from("cadence_steps")
        .delete()
        .eq("cadence_id", selectedCadence.id);

      // Insert new steps
      if (steps.length > 0) {
        const stepsToInsert = steps.map(step => ({
          cadence_id: selectedCadence.id,
          day_offset: step.day_offset,
          task_title: step.task_title,
          task_description: step.task_description,
          task_type: step.task_type,
          priority: step.priority,
        }));

        const { error } = await supabase
          .from("cadence_steps")
          .insert(stepsToInsert);

        if (error) throw error;
      }

      toast.success("Cadência salva com sucesso");
      await selectCadence(selectedCadence); // Refresh steps
    } catch (error) {
      console.error("Error saving steps:", error);
      toast.error("Erro ao salvar cadência");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cadências de Follow-up
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure tarefas automáticas criadas quando um novo lead se cadastra
          </p>
        </div>
        <Button onClick={createCadence}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Cadência
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Lista de Cadências */}
        <div className="space-y-2">
          {cadences.map(cadence => (
            <Card 
              key={cadence.id}
              className={`cursor-pointer transition-colors ${
                selectedCadence?.id === cadence.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => selectCadence(cadence)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{cadence.name}</span>
                    {cadence.is_default && (
                      <Badge variant="secondary" className="text-xs">Padrão</Badge>
                    )}
                  </div>
                  {cadence.is_active ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-muted" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {cadences.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma cadência criada
            </p>
          )}
        </div>

        {/* Main Content - Editor de Cadência */}
        <div className="lg:col-span-3">
          {selectedCadence ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Input
                      value={selectedCadence.name}
                      onChange={(e) => updateCadence({ name: e.target.value })}
                      className="text-lg font-semibold border-0 p-0 h-auto focus-visible:ring-0"
                      placeholder="Nome da cadência"
                    />
                    <CardDescription>
                      Configure as etapas de follow-up automático
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="active" className="text-sm">Ativa</Label>
                      <Switch
                        id="active"
                        checked={selectedCadence.is_active}
                        onCheckedChange={(checked) => updateCadence({ is_active: checked })}
                      />
                    </div>
                    {!selectedCadence.is_default && (
                      <Button variant="outline" size="sm" onClick={setAsDefault}>
                        Definir como Padrão
                      </Button>
                    )}
                    <Button variant="destructive" size="sm" onClick={deleteCadence}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Steps List */}
                <div className="space-y-3">
                  {steps.map((step, index) => {
                    const TypeIcon = taskTypeConfig[step.task_type as keyof typeof taskTypeConfig]?.icon || Phone;
                    return (
                      <Card key={index} className="border-l-4" style={{ borderLeftColor: `var(--${taskTypeConfig[step.task_type as keyof typeof taskTypeConfig]?.color.replace('bg-', '')})` }}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex items-center gap-2 min-w-[80px]">
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                              <Badge variant="outline" className="font-mono">
                                D{step.day_offset + 1}
                              </Badge>
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label className="text-xs">Título da Tarefa</Label>
                                <Input
                                  value={step.task_title}
                                  onChange={(e) => updateStep(index, { task_title: e.target.value })}
                                  placeholder="Ex: Primeira ligação"
                                />
                              </div>

                              <div className="flex gap-2">
                                <div className="space-y-2 flex-1">
                                  <Label className="text-xs">Tipo</Label>
                                  <Select
                                    value={step.task_type}
                                    onValueChange={(value) => updateStep(index, { task_type: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(taskTypeConfig).map(([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                          <div className="flex items-center gap-2">
                                            <config.icon className="h-4 w-4" />
                                            {config.label}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2 flex-1">
                                  <Label className="text-xs">Prioridade</Label>
                                  <Select
                                    value={step.priority}
                                    onValueChange={(value) => updateStep(index, { priority: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(priorityConfig).map(([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                          {config.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2 w-20">
                                  <Label className="text-xs">Dia</Label>
                                  <Input
                                    type="number"
                                    min={0}
                                    value={step.day_offset}
                                    onChange={(e) => updateStep(index, { day_offset: parseInt(e.target.value) || 0 })}
                                  />
                                </div>
                              </div>

                              <div className="md:col-span-2 space-y-2">
                                <Label className="text-xs">Descrição</Label>
                                <Textarea
                                  value={step.task_description}
                                  onChange={(e) => updateStep(index, { task_description: e.target.value })}
                                  placeholder="Instruções para a tarefa..."
                                  className="min-h-[60px]"
                                />
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeStep(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Add Step Button */}
                <Button variant="outline" onClick={addStep} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Etapa
                </Button>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={saveSteps} disabled={saving}>
                    {saving ? "Salvando..." : "Salvar Cadência"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Selecione ou crie uma cadência para configurar
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}