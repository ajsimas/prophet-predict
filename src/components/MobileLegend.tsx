import {coloredGraphDataType, graphDataPointType, hoverDataType} from '@/types';
import {format} from 'd3-format';
import type React from 'react';

export default function MobileLegend({
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
  // Fill two columns, top to bottom
  const rows = Math.ceil(displayData.length / 2);

  return (
    <div className="p-3 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 md:hidden">
      <h3 className="text-xs font-semibold m-0 mb-2 text-gray-800 dark:text-slate-100">
        Apostles
        {hoverData && (
          <span className="text-[10px] font-normal text-gray-500 dark:text-slate-400 ml-1.5">
            {new Date(hoverData.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        )}
      </h3>
      <div className="grid grid-flow-col grid-cols-2 gap-x-3 gap-y-1.5 sm:grid-cols-3 auto-rows-auto" style={{gridTemplateRows: `repeat(${rows}, auto)`}}>
        {displayData.map((item) => {
          // Same color as the apostle's line in the chart
          const color = data.find((series) => series.id === item.id)?.color;
          const pointData = item.data as graphDataPointType | null;

          return (
            <div key={item.id} className="flex items-center gap-1.5 min-w-0 h-[28px]">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: color,
                }}
              />
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="text-gray-700 dark:text-slate-300 leading-tight text-[11px] truncate">
                  {item.id}
                </div>
                <div className="text-[9px] text-gray-500 dark:text-slate-400 tabular-nums leading-tight h-[11px]">
                  {pointData ? (
                    <>
                      {pointData.age !== null && <>{pointData.age}y · </>}
                      {format('.1%')(Number(pointData.y))}
                    </>
                  ) : (
                    <>&nbsp;</>
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
