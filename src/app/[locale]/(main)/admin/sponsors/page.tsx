"use client";

import { useState, useEffect } from "react";
import { SponsorsService } from "@/services/sponsors-service";
import { SponsorListItem, CreateSponsorRequest, UpdateSponsorRequest } from "@/schemas/sponsors-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSponsorRequestSchema, UpdateSponsorRequestSchema } from "@/schemas/sponsors-schema";
import { toast } from "sonner";
import { Loader2, Edit, Trash2, Upload } from "lucide-react";

export default function SponsorsAdminPage() {
  const [sponsors, setSponsors] = useState<SponsorListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<SponsorListItem | null>(null);

  const loadSponsors = async () => {
    try {
      setLoading(true);
      const res = await SponsorsService.getAllSponsors({ page: 0, size: 100 });
      setSponsors(res.items);
    } catch (e: any) {
      setError(e.message || "Failed to load sponsors");
      toast.error("Failed to load sponsors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSponsors();
  }, []);

  const handleCreate = async (data: CreateSponsorRequest) => {
    try {
      await SponsorsService.createSponsor(data);
      toast.success("Sponsor created");
      setCreateOpen(false);
      loadSponsors();
    } catch (e: any) {
      toast.error("Failed to create sponsor");
    }
  };

  const handleUpdate = async (data: UpdateSponsorRequest) => {
    if (!selectedSponsor) return;
    try {
      await SponsorsService.updateSponsor(selectedSponsor.id, data);
      toast.success("Sponsor updated");
      setEditOpen(false);
      setSelectedSponsor(null);
      loadSponsors();
    } catch (e: any) {
      toast.error("Failed to update sponsor");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this sponsor?")) return;
    try {
      await SponsorsService.deleteSponsor(id);
      toast.success("Sponsor deleted");
      loadSponsors();
    } catch (e: any) {
      toast.error("Failed to delete sponsor");
    }
  };

  const handleUploadLogo = async (id: number, file: File) => {
    try {
      await SponsorsService.uploadLogo(id, file);
      toast.success("Logo uploaded");
      loadSponsors();
    } catch (e: any) {
      toast.error("Failed to upload logo: " + e.message);
    }
  };

  const createForm = useForm<CreateSponsorRequest>({
    resolver: zodResolver(CreateSponsorRequestSchema),
    defaultValues: { name: "" },
  });

  const editForm = useForm<UpdateSponsorRequest>({
    resolver: zodResolver(UpdateSponsorRequestSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (selectedSponsor) {
      editForm.reset({ name: selectedSponsor.name });
    }
  }, [selectedSponsor, editForm]);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Sponsors Management</h1>
      <Button onClick={() => setCreateOpen(true)} className="mb-4">Add Sponsor</Button>

      <div className="grid gap-4">
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className="border p-4 rounded flex items-center justify-between">
            <div className="flex items-center gap-4">
              {sponsor.logo_url ? (
                <img src={sponsor.logo_url} alt={sponsor.name} width={50} height={50} className="object-cover" />
              ) : (
                <div className="w-12 h-12 bg-gray-200 flex items-center justify-center">No Logo</div>
              )}
              <span>{sponsor.name}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadLogo(sponsor.id, file);
                }}
                className="hidden"
                id={`upload-${sponsor.id}`}
              />
              <Button variant="outline" size="sm" onClick={() => document.getElementById(`upload-${sponsor.id}`)?.click()}>
                <Upload className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setSelectedSponsor(sponsor); setEditOpen(true); }}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(sponsor.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Sponsor</DialogTitle>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sponsor</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
