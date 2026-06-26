import React from "react";
import { CoursePublishRequest } from "@/schemas/publish-request-schema";
import PublishRequestCard from "@/components/courses/settings/PublishRequestCard";
import MyPublishRequestsList from "@/components/courses/settings/MyPublishRequestsList";
import { useTranslations } from "next-intl";

interface Props {
  latestRequest: CoursePublishRequest | null;
}

const PublishRequestsTab = ({ latestRequest }: Props) => {
  const t = useTranslations("courses.settings.publishRequest");

  return (
    <div className="space-y-6">
      {latestRequest && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t("thisCourse")}
          </h3>
          <PublishRequestCard request={latestRequest} />
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t("allRequests")}
        </h3>
        <MyPublishRequestsList />
      </div>
    </div>
  );
};

export default PublishRequestsTab;
