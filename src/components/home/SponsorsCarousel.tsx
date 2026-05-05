"use client";

import { useEffect, useState } from "react";
import { SponsorsService } from "@/services/sponsors-service";
import { SponsorListItem } from "@/schemas/sponsors-schema";

const MIN_ITEMS_FOR_LOOP = 10;

const SponsorsCarousel = () => {
  const [sponsors, setSponsors] = useState<SponsorListItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="w-full mt-12 py-8">
      <style>{`
        .sponsors-track-wrapper {
          overflow: hidden;
          position: relative;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }
        .sponsors-track {
          display: flex;
          gap: 40px;
          width: max-content;
          animation: sponsors-marquee 24s linear infinite;
        }
        .sponsors-track-wrapper:hover .sponsors-track {
          animation-play-state: paused;
        }
        @keyframes sponsors-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="sponsors-track-wrapper w-full py-4">
        <div className="sponsors-track">
          {items.map((sponsor, index) => (
            <div
              key={`${sponsor.id}-${index}`}
              className="flex-shrink-0 w-36 h-20 flex items-center justify-center
                         opacity-60 grayscale transition-all duration-300
                         hover:opacity-100 hover:grayscale-0"
            >
              {sponsor.logo_url ? (
                <img
                  src={sponsor.logo_url}
                  alt={sponsor.name}
                  className="h-16 w-28 object-contain px-2 select-none pointer-events-none"
                  draggable={false}
                />
              ) : (
                <div className="text-sm font-semibold text-muted-foreground text-center px-2">
                  {sponsor.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorsCarousel;