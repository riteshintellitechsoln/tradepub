"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Category } from "@prisma/client";

import { createCategory, updateCategory, deleteCategory } from "@/actions/admin/categories";
import { categorySchema, type CategoryFormValues } from "@/lib/validations/category";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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

// Dialog-based CRUD (create/edit/delete all from one page) rather than
// dedicated /new and /[id] routes — a category only has 5 fields, so a
// full page navigation for each edit would be more friction than the data
// justifies. Books (many more fields, file references) get real pages
// instead; see book-form.tsx.
export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", description: "", icon: "", order: 0, isActive: true },
  });

  function openCreate() {
    setEditing(null);
    form.reset({
      name: "",
      slug: "",
      description: "",
      icon: "",
      order: categories.length,
      isActive: true,
    });
    setOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    form.reset({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      icon: category.icon ?? "",
      order: category.order,
      isActive: category.isActive,
    });
    setOpen(true);
  }

  async function onSubmit(values: CategoryFormValues) {
    const result = editing
      ? await updateCategory(editing.id, values)
      : await createCategory(values);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(editing ? "Category updated" : "Category created");
    setOpen(false);
    router.refresh();
  }

  async function onDelete(category: Category) {
    if (!confirm(`Delete "${category.name}"? Books stay intact but lose this tag.`)) return;

    const result = await deleteCategory(category.id);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Category deleted");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      <AdminTable
        rows={categories}
        rowKey={(c) => c.id}
        emptyMessage="No categories yet."
        columns={[
          { header: "Order", cell: (c) => c.order },
          { header: "Name", cell: (c) => <span className="font-medium">{c.name}</span> },
          { header: "Slug", cell: (c) => <code className="text-xs">{c.slug}</code> },
          { header: "Active", cell: (c) => (c.isActive ? "Yes" : "No") },
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
            <DialogTitle>{editing ? "Edit Category" : "New Category"}</DialogTitle>
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
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Visible on the public site</FormLabel>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {editing ? "Save changes" : "Create category"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
