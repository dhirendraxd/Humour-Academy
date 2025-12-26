import { useState, useEffect } from "react";
import { Upload, FileText, Trash2, Edit3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
// import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { materialService, Material } from "@/lib/materials";

interface MaterialsManagerProps {
  facultyId: string;
  cohortId?: string;
}

export const MaterialsManager = ({ facultyId, cohortId }: MaterialsManagerProps) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [learningObjectives, setLearningObjectives] = useState(""); // Comma separated for input
  const [prerequisites, setPrerequisites] = useState("");
  const [estimatedStudyTime, setEstimatedStudyTime] = useState("");
  const [resourceType, setResourceType] = useState("PDF");
  const [moduleBreakdown, setModuleBreakdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      const data = await materialService.list();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch materials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        title,
        description,
        file_url: fileUrl,
        learning_objectives: learningObjectives.split(',').map(s => s.trim()).filter(Boolean),
        prerequisites,
        estimated_study_time: estimatedStudyTime,
        resource_type: resourceType,
        module_breakdown: moduleBreakdown
      };

      if (editingMaterial) {
        await materialService.update(editingMaterial.id, payload);
        toast({
          title: "Success",
          description: "Material updated successfully",
        });
      } else {
        await materialService.create(payload);
        toast({
          title: "Success",
          description: "Material added successfully",
        });
      }

      resetForm();
      fetchMaterials();
    } catch (error) {
      console.error('Error saving material:', error);
      toast({
        title: "Error",
        description: "Failed to save material",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setTitle(material.title);
    setDescription(material.description || "");
    setFileUrl(material.file_url || "");
    setLearningObjectives(material.learning_objectives?.join(', ') || "");
    setPrerequisites(material.prerequisites || "");
    setEstimatedStudyTime(material.estimated_study_time || "");
    setResourceType(material.resource_type || "PDF");
    setModuleBreakdown(material.module_breakdown || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      await materialService.delete(materialId);

      toast({
        title: "Success",
        description: "Material deleted successfully",
      });
      fetchMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({
        title: "Error",
        description: "Failed to delete material",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFileUrl("");
    setLearningObjectives("");
    setPrerequisites("");
    setEstimatedStudyTime("");
    setResourceType("PDF");
    setModuleBreakdown("");
    setEditingMaterial(null);
    setIsDialogOpen(false);
  };

  useEffect(() => {
    fetchMaterials();
  }, [facultyId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Course Materials</h2>
          <p className="text-muted-foreground">Manage study materials and resources for your students</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-primary border-0 hover:shadow-glow"
              onClick={() => setEditingMaterial(null)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Material
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingMaterial ? 'Edit Material' : 'Add New Material'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter material title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter material description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileUrl">File URL (Optional)</Label>
                <Input
                  id="fileUrl"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="Enter file URL or upload link"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studyTime">Study Time</Label>
                  <Input
                    id="studyTime"
                    value={estimatedStudyTime}
                    onChange={(e) => setEstimatedStudyTime(e.target.value)}
                    placeholder="e.g. 45 mins"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resourceType">Resource Type</Label>
                  <select
                    id="resourceType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                  >
                    <option>PDF</option>
                    <option>Video</option>
                    <option>Audio</option>
                    <option>E-Book</option>
                    <option>Quiz</option>
                    <option>External Link</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prerequisites">Prerequisites</Label>
                <Input
                  id="prerequisites"
                  value={prerequisites}
                  onChange={(e) => setPrerequisites(e.target.value)}
                  placeholder="e.g. Basic Math"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="moduleBreakdown">Module Breakdown (Chapter list, etc.)</Label>
                <Textarea
                  id="moduleBreakdown"
                  value={moduleBreakdown}
                  onChange={(e) => setModuleBreakdown(e.target.value)}
                  placeholder="Chapter 1: Intro, Chapter 2: The Logic of Satire..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectives">Learning Objectives (comma separated)</Label>
                <Textarea
                  id="objectives"
                  value={learningObjectives}
                  onChange={(e) => setLearningObjectives(e.target.value)}
                  placeholder="Analyze data, Build models, Optimize..."
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-gradient-primary border-0"
                >
                  {isLoading ? 'Saving...' : editingMaterial ? 'Update' : 'Add Material'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {materials.length === 0 ? (
        <Card className="shadow-academic">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No materials yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding study materials and resources for your students
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((material) => (
            <Card key={material.id} className="shadow-academic hover:shadow-glow transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{material.title}</CardTitle>
                  <div className="flex gap-1">
                    {material.resource_type && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100">
                        {material.resource_type}
                      </Badge>
                    )}
                    <Badge variant="outline" className="ml-2">
                      <FileText className="h-3 w-3" />
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {material.description || 'No description provided'}
                </p>

                {material.module_breakdown && (
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Breakdown</span>
                    <p className="text-[10px] text-slate-600 line-clamp-2 italic">{material.module_breakdown}</p>
                  </div>
                )}

                {material.learning_objectives && material.learning_objectives.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Objectives</span>
                    <div className="flex flex-wrap gap-1">
                      {material.learning_objectives.map((obj, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] py-0 border-slate-200 text-slate-600 bg-slate-50/50">
                          {obj}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-1">
                  {material.estimated_study_time && (
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Time</span>
                      <span className="text-xs font-medium text-slate-600">{material.estimated_study_time}</span>
                    </div>
                  )}
                  {material.prerequisites && (
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Prereq</span>
                      <span className="text-xs font-medium text-slate-600 truncate">{material.prerequisites}</span>
                    </div>
                  )}
                </div>

                {material.file_url && (
                  <div className="flex items-center gap-2 pt-1">
                    <Upload className="h-4 w-4 text-blue-600" />
                    <a
                      href={material.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline truncate"
                    >
                      View Resource
                    </a>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 font-medium pt-1">
                  Published {new Date(material.created_at).toLocaleDateString()}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(material)}
                    className="hover:bg-primary/10"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(material.id)}
                    className="hover:bg-destructive/10 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};