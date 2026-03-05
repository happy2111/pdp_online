"use client";

import { useForm } from "react-hook-form";
import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import { RegisterSchema, type RegisterSchema as RegisterSchemaType } from "@/schemas/auth-schema";
import { AuthService } from "@/services/auth-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone_number: "+998",
      gender: null
    }
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      const response = await AuthService.register(data);
      console.log("Success:", response);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <h1 className="text-xl font-bold">Create an account</h1>
        </div>

        {/* Пример отображения полей из вашей схемы */}
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="first_name">First Name</FieldLabel>
            <Input id="first_name" {...register("first_name")} placeholder="John" />
            {errors.first_name && <p className="text-destructive text-xs">{errors.first_name.message}</p>}
          </Field>
          <Field>
            <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
            <Input id="last_name" {...register("last_name")} placeholder="Doe" />
            {errors.last_name && <p className="text-destructive text-xs">{errors.last_name.message}</p>}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input id="username" {...register("username")} />
          {errors.username && <p className="text-destructive text-xs">{errors.username.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="phone_number">Phone Number</FieldLabel>
          <Input id="phone_number" {...register("phone_number")} placeholder="+998XXXXXXXXX" />
          {errors.phone_number && <p className="text-destructive text-xs">{errors.phone_number.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
        </Field>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Registering..." : "Create Account"}
        </Button>
      </FieldGroup>
    </form>
  );
}