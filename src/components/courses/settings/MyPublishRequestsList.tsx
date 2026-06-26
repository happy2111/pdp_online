"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Loader2, SendHorizonal } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CoursesService } from "@/services/courses-service";
import {
  CoursePublishRequest,
  PublishRequestStatus,
} from "@/schemas/publish-request-schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusColor: Record<PublishRequestStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-700 ring-yellow-500/20",
  APPROVED: "bg-green-500/10 text-green-600 ring-green-500/20",
  REJECTED: "bg-red-500/10 text-red-600 ring-red-500/20",
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

const MyPublishRequestsList = () => {
  const t = useTranslations("courses.settings.publishRequest");

  const [requests, setRequests] = useState<CoursePublishRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchRequests = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await CoursesService.getMyPublishRequests({
        page: pageNum,
        size: 10,
      });
      setRequests(res.items);
      setTotalPages(res.total_pages);
      setPage(res.current_page);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests(0);
  }, [fetchRequests]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="border bg-card/60 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <SendHorizonal className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="font-medium">{t("emptyTitle")}</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {t("emptyDesc")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="border bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
              <Link
                href={`/courses/${request.course_slug}/settings`}
                className="hover:text-primary transition-colors"
              >
                {request.course_title}
              </Link>
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
          <CardContent className="grid gap-2 text-sm sm:grid-cols-3">
            <div>
              <p className="text-muted-foreground">{t("submittedAt")}</p>
              <p>{formatDate(request.created_at)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("reviewedAt")}</p>
              <p>{formatDate(request.reviewed_at)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("rejectionReason")}</p>
              <p className="truncate">{request.admin_comment || "—"}</p>
            </div>
          </CardContent>
        </Card>
      ))}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 0 || loading}
            onClick={() => fetchRequests(page - 1)}
          >
            {t("prevPage")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1 || loading}
            onClick={() => fetchRequests(page + 1)}
          >
            {t("nextPage")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyPublishRequestsList;
