"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Book, Company, Category } from "@prisma/client";

import { bookSchema, type BookFormValues } from "@/lib/validations/book";
import { createBook, updateBook } from "@/actions/admin/books";
import { slugify } from "@/lib/utils";
import { BOOK_FORMAT_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface BookFormProps {
  companies: Pick<Company, "id" | "name">[];
  categories: Pick<Category, "id" | "name">[];
  book?: Book & { categories: { categoryId: string }[] };
}

// One form, two modes (create/edit), same shape as every other Admin form
// in this app: React Hook Form + the same Zod schema the server action
// re-validates with, toast on success/failure, router.refresh() to pick up
// the new data.
export function BookForm({ companies, categories, book }: BookFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: book
      ? {
          title: book.title,
          slug: book.slug,
          description: book.description,
          shortDescription: book.shortDescription ?? "",
          coverImageUrl: book.coverImageUrl,
          pdfFileKey: book.pdfFileKey,
          pages: book.pages ?? undefined,
          language: book.language,
          format: book.format,
          status: book.status,
          isFeatured: book.isFeatured,
          isTrending: book.isTrending,
          tags: book.tags.join(", "),
          companyId: book.companyId,
          categoryIds: book.categories.map((c) => c.categoryId),
        }
      : {
          title: "",
          slug: "",
          description: "",
          shortDescription: "",
          coverImageUrl: "",
          pdfFileKey: "",
          language: "English",
          format: "EBOOK",
          status: "DRAFT",
          isFeatured: false,
          isTrending: false,
          tags: "",
          companyId: "",
          categoryIds: [],
        },
  });

  async function onSubmit(values: BookFormValues) {
    setIsSubmitting(true);
    const result = book ? await updateBook(book.id, values) : await createBook(values);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(book ? "Book updated" : "Book created");
    router.push("/admin/books");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl space-y-6" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (!book) form.setValue("slug", slugify(e.target.value));
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
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Short description <span className="text-muted-foreground">(for book cards)</span>
              </FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="coverImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormDescription>
                  A Cloudinary upload widget lands once real credentials exist — paste a
                  hosted image URL for now.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pdfFileKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PDF file key (R2)</FormLabel>
                <FormControl>
                  <Input placeholder="books/my-ebook.pdf" {...field} />
                </FormControl>
                <FormDescription>
                  The object key in your R2 bucket — never a public URL. Upload UI lands
                  once real R2 credentials exist.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="pages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pages</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />

                  {/* <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const parsed = e.target.valueAsNumber;
                      field.onChange(Number.isNaN(parsed) ? undefined : parsed);
                    }}
                  /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Format</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BOOK_FORMAT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publisher</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select publisher" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tags <span className="text-muted-foreground">(comma-separated)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="cloud, security, enterprise" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryIds"
          render={() => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <div className="grid grid-cols-2 gap-2 rounded-md border p-3 sm:grid-cols-3">
                {categories.map((category) => (
                  <FormField
                    key={category.id}
                    control={form.control}
                    name="categoryIds"
                    render={({ field }) => {
                      const checked = field.value?.includes(category.id);
                      return (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(isChecked) => {
                                const next = isChecked
                                  ? [...(field.value ?? []), category.id]
                                  : (field.value ?? []).filter((id) => id !== category.id);
                                field.onChange(next);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">{category.name}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="font-normal">Featured</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isTrending"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="font-normal">Trending</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {book ? "Save changes" : "Create book"}
        </Button>
      </form>
    </Form>
  );
}
