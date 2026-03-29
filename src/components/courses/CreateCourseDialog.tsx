"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCourseSchema, CreateCourseRequest } from "@/schemas/courses-schema";
import { CoursesService } from "@/services/courses-service";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateCourseDialog({ open, onOpenChange, onSuccess }: Props) {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateCourseRequest>({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues: {
      title: "",
      short_description: "",
      description: "",
      level: "BEGINNER",
      language: "RU",
      category_id: 1,
      requirements: [""],
      learning_outcomes: [""],
      price: 0
    }
  });

  const { fields: reqFields, append: appendReq, remove: removeReq } = useFieldArray({
    control: form.control,
    name: "requirements" as never
  });

  const { fields: outFields, append: appendOut, remove: removeOut } = useFieldArray({
    control: form.control,
    name: "learning_outcomes" as never
  });

  const onSubmit = async (data: CreateCourseRequest) => {
    setLoading(true);
    try {
      // Фильтруем пустые строки перед отправкой
      const payload = {
        ...data,
        requirements: data.requirements.filter(i => i.trim() !== ""),
        learning_outcomes: data.learning_outcomes.filter(i => i.trim() !== ""),
      };

      await CoursesService.create(payload);
      toast.success(t('courses.create_success'));
      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error(t('courses.create_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('courses.dialog.title')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Основная инфа */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('courses.dialog.course_title')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('courses.dialog.course_title_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('courses.dialog.short_description')}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('courses.dialog.level')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BEGINNER">{t('courses.level.beginner')}</SelectItem>
                          <SelectItem value="INTERMEDIATE">{t('courses.level.intermediate')}</SelectItem>
                          <SelectItem value="ADVANCED">{t('courses.level.advanced')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('courses.dialog.price')}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Динамические требования (Requirements) */}
            <div className="space-y-3">
              <FormLabel>{t('courses.dialog.requirements')}</FormLabel>
              {reqFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`requirements.${index}` as any}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder={t('courses.dialog.requirements_placeholder')} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeReq(index)}
                    disabled={reqFields.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full border-dashed"
                onClick={() => appendReq("")}
              >
                <Plus className="h-4 w-4 mr-2" /> {t('courses.dialog.add_item')}
              </Button>
            </div>

            {/* Динамические результаты (Learning Outcomes) */}
            <div className="space-y-3">
              <FormLabel>{t('courses.dialog.learning_outcomes')}</FormLabel>
              {outFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`learning_outcomes.${index}` as any}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder={t('courses.dialog.learning_outcomes_placeholder')} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOut(index)}
                    disabled={outFields.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full border-dashed"
                onClick={() => appendOut("")}
              >
                <Plus className="h-4 w-4 mr-2" /> {t('courses.dialog.add_item')}
              </Button>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('courses.dialog.description')}</FormLabel>
                  <FormControl><Textarea rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('courses.dialog.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}