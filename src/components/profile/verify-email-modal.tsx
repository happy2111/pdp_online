'use client'

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2, Mail, ShieldCheck, AlertCircle } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp"
import { AuthService } from "@/services/auth-service"
import {cn} from "@/lib/utils";

interface VerifyEmailModalProps {
  email: string
  isVerified: boolean
  onSuccess: () => void
}

export function VerifyEmailModal({ email, isVerified, onSuccess }: VerifyEmailModalProps) {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'send' | 'verify'>('send')
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState("")

  // Сброс состояния при закрытии/открытии
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setTimeout(() => {
        setStep('send')
        setCode("")
      }, 300) // задержка, чтобы анимация закрытия завершилась плавно
    }
  }

  const handleSendCode = async () => {
    setIsLoading(true)
    try {
      await AuthService.sendCode()
      toast.success(t("auth.verify.code_sent") || "Код отправлен на почту")
      setStep('verify')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t("errors.1000"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (code.length < 6) return
    setIsLoading(true)
    try {
      await AuthService.verifyCode({ code })
      toast.success(t("auth.verify.success") || "Email успешно подтвержден!")
      onSuccess() // Обновляем профиль в родительском компоненте
      setIsOpen(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t("auth.verify.invalid_code") || "Неверный код")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          disabled={isVerified}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium transition-all",
            isVerified
              ? "text-green-500 cursor-default"
              : "text-primary hover:underline hover:opacity-80"
          )}
        >
          {isVerified ? (
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t("auth.verify.verified") || "Подтвержден"}
            </span>
          ) : (
            t("auth.verify.action") || "Подтвердить"
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 'send' ? (
              <Mail className="h-5 w-5" />
            ) : (
              <ShieldCheck className="h-5 w-5 text-primary" />
            )}
            {step === 'send'
              ? t("auth.verify.modal_title") || "Подтверждение почты"
              : t("auth.verify.enter_code") || "Введите код"
            }
          </DialogTitle>
          <DialogDescription className="pt-2">
            {step === 'send'
              ? (t("auth.verify.modal_desc") || `Мы отправим 6-значный код на почту:`)
              : (t("auth.verify.code_desc") || `Код был отправлен на почту.`)
            }
            {step === 'send' && <strong className="block text-foreground mt-1">{email}</strong>}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6">
          {step === 'send' ? (
            <div className="bg-primary/5 p-6 rounded-full">
              <Mail className="h-12 w-12 text-primary/40" />
            </div>
          ) : (
            <div className="space-y-4 flex flex-col items-center w-full">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                disabled={isLoading}
                autoFocus
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="rounded-md border" />
                  <InputOTPSlot index={1} className="rounded-md border" />
                  <InputOTPSlot index={2} className="rounded-md border" />
                  <InputOTPSlot index={3} className="rounded-md border" />
                  <InputOTPSlot index={4} className="rounded-md border" />
                  <InputOTPSlot index={5} className="rounded-md border" />
                </InputOTPGroup>
              </InputOTP>
              <p className="text-[13px] text-muted-foreground flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                {t("auth.verify.check_spam") || "Проверьте папку Спам"}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {step === 'send' ? (
            <Button
              onClick={handleSendCode}
              disabled={isLoading}
              className="w-full h-11 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("auth.verify.send_btn") || "Отправить код"
              )}
            </Button>
          ) : (
            <>
              <Button
                onClick={handleVerifyCode}
                disabled={isLoading || code.length < 6}
                className="w-full h-11 rounded-xl"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("auth.verify.confirm_btn") || "Подтвердить код"
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setStep('send')}
                disabled={isLoading}
                className="text-xs hover:bg-transparent hover:text-primary transition-colors"
              >
                {t("auth.verify.resend") || "Отправить код повторно"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}