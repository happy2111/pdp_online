"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SponsorsService } from "@/services/sponsors-service";
import { SponsorListItem } from "@/schemas/sponsors-schema";

const MIN_ITEMS_FOR_LOOP = 10;

const SponsorsCarousel = () => {
  const t = useTranslations();
  const [sponsors, setSponsors] = useState<SponsorListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const res = await SponsorsService.getAllSponsors({ page: 0, size: 20 });
      setSponsors(res?.items || []);
    } catch (err) {
      console.error("Failed to fetch sponsors:", err);
      setSponsors([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !sponsors.length) return null;

  const repeated = sponsors.length < MIN_ITEMS_FOR_LOOP
    ? Array.from(
      { length: Math.ceil(MIN_ITEMS_FOR_LOOP / sponsors.length) },
      () => sponsors
    ).flat()
    : sponsors;

  const items = [...repeated, ...repeated];

  return (
    <div className="w-full my-16 pt-8">
      <style>{`
        .graduates-track-wrapper {
          overflow: hidden;
          position: relative;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
        }
        .graduates-track {
          display: flex;
          gap: 60px;
          width: max-content;
          animation: graduates-marquee 28s linear infinite;
        }
        .graduates-track-wrapper:hover .graduates-track {
          animation-play-state: paused;
        }
        .graduates-track-wrapper.scrolling-active .graduates-track {
          animation-play-state: paused !important;
        }
        @keyframes graduates-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .sponsor-item {
          transition: all 0.3s ease;
        }
        .sponsor-item:not(.active) {
          opacity: 0.5;
          filter: grayscale(100%);
        }
        .sponsor-item.active {
          opacity: 1;
          filter: grayscale(0%);
        }
      `}</style>

      <div className="text-center space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("graduates.title")}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {t("graduates.description")}
          </p>
          <p className="text-sm text-primary/70 font-medium">
            {t("graduates.subtitle")}
          </p>
        </div>

        {/* Carousel */}
        <div 
          className={`graduates-track-wrapper w-full py-8 ${isHovering ? "scrolling-active" : ""}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="graduates-track">
            {items.map((sponsor, index) => (
              <div
                key={`${sponsor.id}-${index}`}
                className={`sponsor-item flex-shrink-0 w-40 h-24 flex items-center justify-center rounded-lg transition-all duration-300 ${
                  isHovering ? "active" : ""
                }`}
              >
                {sponsor.logo_url ? (
                  <img
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    className="h-20 w-32 object-contain select-none pointer-events-none"
                    draggable={false}
                  />
                ) : (
                  <div className="text-sm font-semibold text-muted-foreground text-center px-3">
                    {sponsor.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Decorative hint */}
        <p className="text-xs text-muted-foreground/60">
          {t("graduates.subtitle")}
        </p>
      </div>
    </div>
  );
};

export default SponsorsCarousel;