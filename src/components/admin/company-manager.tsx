"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Company } from "@prisma/client";

import { createCompany, updateCompany, deleteCompany } from "@/actions/admin/companies";
import { companySchema, type CompanyFormValues } from "@/lib/validations/company";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AdminTable } from "@/components/admin/admin-table";

// Same Dialog-based CRUD pattern as CategoryManager. Companies here are
// PUBLISHERS/vendors — see the design note on the Company model in
// prisma/schema.prisma — not a lead's employer.
export function CompanyManager({ companies }: { companies: Company[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: { name: "", slug: "", domain: "", logoUrl: "", website: "", about: "" },
  });

  function openCreate() {
    setEditing(null);
    form.reset({ name: "", slug: "", domain: "", logoUrl: "", website: "", about: "" });
    setOpen(true);
  }

  function openEdit(company: Company) {
    setEditing(company);
    form.reset({
      name: company.name,
      slug: company.slug,
      domain: company.domain ?? "",
      logoUrl: company.logoUrl ?? "",
      website: company.website ?? "",
      about: company.about ?? "",
    });
    setOpen(true);
  }

  async function onSubmit(values: CompanyFormValues) {
    const result = editing
      ? await updateCompany(editing.id, values)
      : await createCompany(values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(editing ? "Publisher updated" : "Publisher created");
    setOpen(false);
    router.refresh();
  }

  async function onDelete(company: Company) {
    if (!confirm(`Delete "${company.name}"?`)) return;

    const result = await deleteCompany(company.id);
    if (!result.success) {
      // Most likely: "still has N books" from the Restrict constraint —
      // see the comment on deleteCompany() in actions/admin/companies.ts.
      toast.error(result.error);
      return;
    }
    toast.success("Publisher deleted");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Publisher
        </Button>
      </div>

      <AdminTable
        rows={companies}
        rowKey={(c) => c.id}
        emptyMessage="No publishers yet."
        columns={[
          { header: "Name", cell: (c) => <span className="font-medium">{c.name}</span> },
          { header: "Domain", cell: (c) => c.domain ?? "—" },
          {
            header: "Website",
            cell: (c) =>
              c.website ? (
                <a href={c.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  {c.website}
                </a>
              ) : (
                "—"
              ),
          },
          {
            header: "",
            className: "text-right",
            cell: (c) => (
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(c)} aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(c)} aria-label="Delete">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Publisher" : "New Publisher"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!editing) form.setValue("slug", slugify(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Domain <span className="text-muted-foreground">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="acme.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Website <span className="text-muted-foreground">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://acme.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Logo URL <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      About <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {editing ? "Save changes" : "Create publisher"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
