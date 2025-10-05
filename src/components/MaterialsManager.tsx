import { useState, useEffect } from "react";
import { Upload, FileText, Trash2, Edit3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Material {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  faculty_id: string;
  created_at: string;
}

interface MaterialsManagerProps {
  facultyId: string;
}

export const MaterialsManager = ({ facultyId }: MaterialsManagerProps) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('faculty_id', facultyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch materials",
        variant: "destructive",
      });
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
      if (editingMaterial) {
        // Update existing material
        const { error } = await supabase
          .from('materials')
          .update({
            title,
            description,
            file_url: fileUrl,
          })
          .eq('id', editingMaterial.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Material updated successfully",
        });
      } else {
        // Create new material
        const { error } = await supabase
          .from('materials')
          .insert({
            title,
            description,
            file_url: fileUrl,
            faculty_id: facultyId,
          });

        if (error) throw error;

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
    setIsDialogOpen(true);
  };

  const handleDelete = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', materialId);

      if (error) throw error;

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
                  <Badge variant="secondary" className="ml-2">
                    <FileText className="h-3 w-3" />
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {material.description || 'No description provided'}
                </p>
                
                {material.file_url && (
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-primary" />
                    <a
                      href={material.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline truncate"
                    >
                      View File
                    </a>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Added {new Date(material.created_at).toLocaleDateString()}
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