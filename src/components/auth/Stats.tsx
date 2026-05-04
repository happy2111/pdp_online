import React, {useEffect} from 'react'
import CountUp from "react-countup";
import {useStatsStore} from "@/stores/stats-store";

const Stats = () => {
  const { stats, isLoading, fetchStats } = useStatsStore();

  useEffect(() => {
    fetchStats();
  }, []);



  return (
    <div className="relative z-10 flex items-end gap-10">
      <div className="transform transition-all duration-700 ease-out animate-[fadeInUp_0.8s_ease]">
        <div className="text-3xl font-bold">
          {isLoading ? (
            "..."
          ) : (
            <CountUp end={stats?.students ?? 0} duration={1.5} />
          )}
        </div>
        <div className="text-[11px] opacity-80 font-medium uppercase tracking-wider mt-1">
          O'quvchilar
        </div>
      </div>
      <div className="transform transition-all duration-700 ease-out animate-[fadeInUp_0.8s_ease]">
        <div className="text-3xl font-bold">
          {isLoading ? (
            "..."
          ) : (
            <CountUp end={stats?.courses ?? 0} duration={1.5} />
          )}
        </div>
        <div className="text-[11px] opacity-80 font-medium uppercase tracking-wider mt-1">
          Kurslar
        </div>
      </div>
      <div className="transform transition-all duration-700 ease-out animate-[fadeInUp_0.8s_ease]">
        <div className="text-3xl font-bold">
          {isLoading ? (
            "..."
          ) : (
            <CountUp end={stats?.teachers ?? 0} duration={1.5} />
          )}
        </div>
        <div className="text-[11px] opacity-80 font-medium uppercase tracking-wider mt-1">
          O'qituvchilar
        </div>
      </div>


    </div>
  )
}
export default Stats
