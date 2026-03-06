"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Loader2, ChevronLeft, ChevronRight, Eye, EyeOff, Check } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { LoginSchema, type LoginSchemaType } from "@/schemas/auth-schema";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {Link} from "@/i18n/navigation";

export function LoginForm({ className }: { className?: string }) {
  const t = useTranslations();
  const router = useRouter();
  const loginAction = useAuthStore((state) => state.login);

  const [showPass, setShowPass] = useState(false);
  const [isPending, startTransition] = useTransition();

  const dynamicSchema = LoginSchema(t);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchemaType>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      username_or_email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    startTransition(async () => {
      try {
        await loginAction(data, router, t);
      } catch (error: any) {
        toast.error(t(`errors.${error.message}`) || t("errors.1000"));
      }
    });
  };

  return (
    <Card className={cn("relative z-10 w-full backdrop-blur-xl bg-background/70 shadow-2xl border-muted/40", className)}>
      <CardHeader className="space-y-1 flex flex-col items-center">
        <div className="flex size-20 items-center justify-center rounded-xl bg-green-800/10 mb-2 p-2 shadow-sm border border-green-500/20">
          <Image src="/logo.svg" alt="Logo" width={100} height={100} className="object-contain" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight">{t("auth.login.title")}</h1>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <Field>
              <FieldLabel>{t("auth.fields.username")}</FieldLabel>
              <Input {...register("username_or_email")} placeholder="example@mail.com" />
              {errors.username_or_email && (
                <p className="text-destructive text-[10px]">{errors.username_or_email.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel>{t("auth.fields.password")}</FieldLabel>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  {...register("password")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-[10px]">{errors.password.message}</p>
              )}
            </Field>
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t("auth.login.submit")}
          </Button>

          <div className="text-center text-sm pt-4">
            <span className="text-muted-foreground">{t("auth.login.noAccount")}{" "}</span>
            <Link href="/register" className="font-medium text-primary hover:underline underline-offset-4">
              {t("auth.login.registerLink")}
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}