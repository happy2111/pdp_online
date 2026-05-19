"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Mail, MessageSquare, Phone, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { ContactSchema, ContactSchemaType } from "@/schemas/contact-schema"
import { contactService } from "@/services/contact-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPhone } from "@/lib/utils"

const ContactUs = () => {
  const t = useTranslations()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ContactSchemaType>({
    resolver: zodResolver(ContactSchema(t)),
    defaultValues: {
      name: "",
      phone: "+998",
      telegram_username: "",
      message: "",
    },
  })

  const onSubmit = async (values: ContactSchemaType) => {
    try {
      setIsSubmitting(true)
      const response = await contactService.create(values)

      if (response && response.code === 0) {
        toast.success(t("contact.success_message"))
        reset()
      } else {
        toast.error(response?.message || t("UNKNOWN_ERROR"))
      }
    } catch (error: any) {
      console.error("Contact form error:", error)
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        t("UNKNOWN_ERROR")
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative py-16 md:py-0 overflow-x-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute bottom-[10%] left-[5%] w-72 h-72 rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            {t("contact.title")}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          <div className="space-y-4 md:space-y-6">
            <Card className="border border-border/50 backdrop-blur-sm hover:shadow-lg transition-shadow hover:border-primary/30">
              <CardHeader className="pb-4 md:pb-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 md:p-3 bg-primary/10 rounded-lg">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <CardTitle className="text-base md:text-xl">{t("contact.email")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm md:text-base">
                  {t("contact.email_description")}
                </p>
                <a
                  href="mailto:support@pdponline.uz"
                  className="text-primary hover:underline block text-sm md:text-base font-semibold transition-colors"
                >
                  support@pdponline.uz
                </a>
              </CardContent>
            </Card>

            <Card className="border border-border/50 backdrop-blur-sm hover:shadow-lg transition-shadow hover:border-primary/30">
              <CardHeader className="pb-4 md:pb-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 md:p-3 bg-primary/10 rounded-lg">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <CardTitle className="text-base md:text-xl">{t("contact.phone")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm md:text-base">
                  {t("contact.phone_description")}
                </p>
                <a
                  href="tel:+998900000000"
                  className="text-primary hover:underline block text-sm md:text-base font-semibold transition-colors"
                >
                  +998 (90) 000-00-00
                </a>
              </CardContent>
            </Card>

            <Card className="border border-border/50 backdrop-blur-sm hover:shadow-lg transition-shadow hover:border-primary/30">
              <CardHeader className="pb-4 md:pb-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 md:p-3 bg-primary/10 rounded-lg">
                    <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <CardTitle className="text-base md:text-xl">{t("contact.support")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm md:text-base">
                  {t("contact.support_description")}
                </p>
                <p className="text-primary text-sm md:text-base font-semibold">
                  24/7 {t("contact.available")}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border border-border/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-6 md:pb-8">
                <CardTitle className="text-2xl md:text-3xl">{t("contact.form_title")}</CardTitle>
                <CardDescription className="text-sm md:text-base mt-2">
                  {t("contact.form_description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                  <div>
                    <label className="block text-sm md:text-base font-semibold mb-3">
                      {t("contact.fields.name")}
                    </label>
                    <Input
                      {...register("name")}
                      placeholder={t("contact.fields.name_placeholder")}
                      className="h-12 md:h-14 text-base md:text-lg rounded-xl border-border/50 focus:border-primary"
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="text-destructive text-xs md:text-sm mt-2 font-medium">
                        {t("errors.zod.required")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm md:text-base font-semibold mb-3">
                      {t("contact.fields.phone")}
                    </label>
                    <Input
                      placeholder="+998 90 000 00 00"
                      value={formatPhone(watch("phone")?.replace("+998", "") || "")}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                        setValue("phone", `+998${digits}`, { shouldValidate: true });
                      }}
                      className="h-12 md:h-14 text-base md:text-lg rounded-xl border-border/50 focus:border-primary"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs md:text-sm text-muted-foreground mt-2">
                      {t("contact.fields.phone_format")}
                    </p>
                    {errors.phone && (
                      <p className="text-destructive text-xs md:text-sm mt-1 font-medium">
                        {t("errors.zod.phone_invalid")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm md:text-base font-semibold mb-3">
                      {t("contact.fields.telegram")}
                      <span className="text-xs md:text-sm text-muted-foreground font-normal ml-2">
                        ({t("contact.fields.optional")})
                      </span>
                    </label>
                    <Input
                      {...register("telegram_username")}
                      placeholder="@username"
                      className="h-12 md:h-14 text-base md:text-lg rounded-xl border-border/50 focus:border-primary"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs md:text-sm text-muted-foreground mt-2">
                      {t("contact.fields.telegram_format")}
                    </p>
                    {errors.telegram_username && (
                      <p className="text-destructive text-xs md:text-sm mt-1 font-medium">
                        Неверный формат телеграма
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm md:text-base font-semibold mb-3">
                      {t("contact.fields.message")}
                    </label>
                    <Textarea
                      {...register("message")}
                      placeholder={t("contact.fields.message_placeholder")}
                      className="resize-none text-base md:text-lg rounded-xl border-border/50 focus:border-primary min-h-32 md:min-h-40"
                      rows={5}
                      disabled={isSubmitting}
                    />
                    <p className="text-xs md:text-sm text-muted-foreground mt-2">
                      {t("contact.fields.message_length")}
                    </p>
                    {errors.message && (
                      <p className="text-destructive text-xs md:text-sm mt-1 font-medium">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 md:h-14 text-base md:text-lg font-semibold rounded-xl gap-2"
                    size="lg"
                  >
                    {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {isSubmitting
                      ? t("contact.submitting")
                      : t("contact.submit")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactUs


