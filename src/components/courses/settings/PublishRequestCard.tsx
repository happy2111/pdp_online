import React from "react";
import { AlertCircle, Clock, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CoursePublishRequest,
  PublishRequestStatus,
} from "@/schemas/publish-request-schema";

const statusColor: Record<PublishRequestStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-700 ring-yellow-500/20",
  APPROVED: "bg-green-500/10 text-green-600 ring-green-500/20",
  REJECTED: "bg-red-500/10 text-red-600 ring-red-500/20",
};

interface Props {
  request: CoursePublishRequest;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

const PublishRequestCard = ({ request }: Props) => {
  const t = useTranslations("courses.settings.publishRequest");

  return (
    <Card className="border bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between gap-3 text-lg">
          <span className="flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-primary" />
            {t("currentTitle")}
          </span>
          <Badge
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium ring-1",
              statusColor[request.status]
            )}
          >
            {t(`status.${request.status.toLowerCase()}`)}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground">{t("submittedAt")}</p>
            <p className="font-medium">{formatDate(request.created_at)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t("reviewedAt")}</p>
            <p className="font-medium">{formatDate(request.reviewed_at)}</p>
          </div>
        </div>

        {request.status === "REJECTED" && request.admin_comment && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <p className="mb-1 flex items-center gap-1.5 font-medium text-destructive">
              <AlertCircle className="h-4 w-4" />
              {t("rejectionReason")}
            </p>
            <p className="text-muted-foreground">{request.admin_comment}</p>
          </div>
        )}

        {request.status === "PENDING" && (
          <p className="flex items-start gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-muted-foreground">
            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
            {t("pendingHint")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PublishRequestCard;
