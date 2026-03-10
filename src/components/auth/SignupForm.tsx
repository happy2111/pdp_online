"use client";

import Image from 'next/image';
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Loader2, ChevronLeft, ChevronRight, Check, Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { RegisterSchema, RegisterSchemaType } from "@/schemas/auth-schema";
import { useAuthStore } from "@/stores/auth-store";
import {cn, formatPhone} from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

export function SignupForm({ className }: { className?: string }) {
  const t = useTranslations();
  const router = useRouter();
  const registerAction = useAuthStore((state) => state.register);

  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const totalSteps = 3; // увеличиваем шаги

  const dynamicSchema = RegisterSchema(t);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RegisterSchemaType & { confirm_password?: string }>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      username: "", email: "", password: "",
      first_name: "", last_name: "",
      phone_number: "+998", gender: null,
    }
  });

  const selectedGender = watch("gender");

  const nextStep = async () => {
    let fieldsToValidate: string[] = [];

    if (step === 1) fieldsToValidate = ["first_name", "last_name", "username"];
    if (step === 2) fieldsToValidate = ["email", "phone_number"];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setStep(step + 1);
  };

  const onSubmit = async (data: RegisterSchemaType) => {
    startTransition(async () => {
      try {
        await registerAction(data, router, t);
      } catch (error: any) {
        toast.error(t(`errors.${error.message}`) || t("errors.1000"));
      }
    });
  };

  return (
    <Card className={cn("relative z-10 w-full backdrop-blur-xl bg-background/70 shadow-2xl border-muted/40", className)}>
      <CardHeader className="space-y-1 flex flex-col items-center">
        <Link href={'/public'} className="flex size-20 items-center justify-center rounded-xl bg-green-800/10 mb-2 p-2 shadow-sm border border-green-500/20">
          <Image src="/logo.svg" alt="Logo" width={100} height={100} className="object-contain" />
        </Link>

        <h1 className="text-2xl font-bold tracking-tight">{t("auth.register.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("common.step").replace("...", "")} {step} / {totalSteps}</p>

        <div className="w-full h-1.5 bg-muted rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-green-600 transition-all duration-500 ease-in-out shadow-[0_0_8px_rgba(22,163,74,0.5)]"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className={"form-card"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>{t("auth.fields.firstName")}</FieldLabel>
                  <Input {...register("first_name")} />
                  {errors.first_name && <p className="text-destructive text-[10px]">{t("errors.zod.required")}</p>}
                </Field>
                <Field>
                  <FieldLabel>{t("auth.fields.lastName")}</FieldLabel>
                  <Input {...register("last_name")} />
                  {errors.last_name && <p className="text-destructive text-[10px]">{t("errors.zod.required")}</p>}
                </Field>
              </div>

              <Field>
                <FieldLabel>{t("auth.fields.username")}</FieldLabel>
                <Input {...register("username")} />
                {errors.username && <p className="text-destructive text-[10px]">{t("errors.zod.required")}</p>}
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <Field>
                <FieldLabel>{t("auth.fields.email")}</FieldLabel>
                <Input type="email" {...register("email")} placeholder="example@mail.com" />
                {errors.email && <p className="text-destructive text-[10px]">{t("errors.zod.invalid_email")}</p>}
              </Field>

              <Field>
                <FieldLabel>{t("auth.fields.phoneNumber")}</FieldLabel>
                <Input
                  placeholder="90 123-45-67"
                  value={formatPhone(watch("phone_number")?.replace("+998", "") || "")}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                    setValue("phone_number", `+998${digits}`, { shouldValidate: true });
                  }}
                />
                {errors.phone_number && <p className="text-destructive text-[10px]">{t("errors.zod.phone_invalid")}</p>}
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <Field>
                <FieldLabel>{t("auth.fields.gender")}</FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={selectedGender === "male" ? "default" : "outline"}
                    className="w-full transition-all"
                    onClick={() => setValue("gender", "male", { shouldValidate: true })}
                  >
                    {t("common.male")}
                  </Button>
                  <Button
                    type="button"
                    variant={selectedGender === "female" ? "default" : "outline"}
                    className="w-full transition-all"
                    onClick={() => setValue("gender", "female", { shouldValidate: true })}
                  >
                    {t("common.female")}
                  </Button>
                </div>
                {errors.gender && <p className="text-destructive text-[10px]">{t("errors.gender_required")}</p>}
              </Field>

              <Field>
                <FieldLabel>{t("auth.fields.password")}</FieldLabel>
                <div className="relative">
                  <Input type={showPass ? "text" : "password"} {...register("password")} className="pr-10" />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-destructive text-[10px]">{errors.password.message}</p>}
              </Field>

              <Field>
                <FieldLabel>{t("auth.fields.confirmPassword")}</FieldLabel>
                <div className="relative">
                  <Input type={showConfirm ? "text" : "password"} {...register("confirm_password")} className="pr-10" />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirm_password && <p className="text-destructive text-[10px]">{t("errors.zod.password_mismatch")}</p>}
              </Field>
            </div>
          )}

          <div className="flex gap-3 pt-4 flex-wrap">
            {step > 1 && (
              <Button type="button" variant="ghost" onClick={() => setStep(step - 1)} className="flex-1">
                <ChevronLeft className="mr-2 size-4" />
                {t("common.back")}
              </Button>
            )}

            {step < totalSteps ? (
              <Button type="button" onClick={nextStep} className="flex-1 ml-auto group">
                {t("common.next")}
                <ChevronRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isPending ? t("auth.register.submitting") : t("auth.register.submit")}
              </Button>
            )}
          </div>
        </form>

        <div className="text-center text-sm pt-4">
          <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
            {t("auth.register.loginLink")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}