import {coloredGraphDataType, graphDataPointType, hoverDataType} from '@/types';
import {format} from 'd3-format';
import type React from 'react';

export default function DesktopLegend({
  data,
  hoverData,
}: {
  data: coloredGraphDataType[];
  hoverData: hoverDataType;
}): React.JSX.Element {
  // If hovering, list by probability on that date (LineGraph sorts the
  // points), otherwise by seniority
  const displayData = hoverData
    ? hoverData.points
    : data.map((series) => ({id: series.id, data: null}));

  return (
    <div className="hidden md:block absolute top-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-4 w-[300px] z-10">
      <h3 className="text-sm font-semibold m-0 mb-3 text-gray-800 dark:text-slate-100">
        Apostles
        {hoverData && (
          <span className="text-xs font-normal text-gray-500 dark:text-slate-400 ml-2">
            {new Date(hoverData.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        )}
      </h3>
      <div className="space-y-1.5">
        {displayData.map((item) => {
          // Same color as the apostle's line in the chart
          const color = data.find((series) => series.id === item.id)?.color;
          const pointData = item.data as graphDataPointType | null;

          return (
            <div key={item.id} className="flex items-center gap-2 h-[24px]">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: color,
                }}
              />
              <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                <span className="text-sm text-gray-700 dark:text-slate-300 leading-tight truncate">
                  {item.id}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0 text-xs w-[100px] justify-end">
                  {pointData ? (
                    <>
                      {pointData.age !== null && (
                        <span className="text-gray-500 dark:text-slate-400 tabular-nums">
                          {pointData.age}y
                        </span>
                      )}
                      <span className="font-semibold text-gray-900 dark:text-slate-100 tabular-nums min-w-[48px] text-right">
                        {format('.1%')(Number(pointData.y))}
                      </span>
                    </>
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
