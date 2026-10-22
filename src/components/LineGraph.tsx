import {ResponsiveLine} from '@nivo/line';
import {timeYear} from 'd3-time';
import {timeFormat} from 'd3-time-format';
import {graphDataType, graphDataPointType, hoverDataType} from '@/types';
import {useState, useEffect, useCallback} from 'react';
import type React from 'react';
import {useTheme} from '@/contexts/ThemeContext';
import DesktopLegend from './DesktopLegend';
import MobileLegend from './MobileLegend';
import {colorSeries} from './seriesColors';

export default function LineGraph({
  data,
}: {
  data: graphDataType[];
}): React.JSX.Element {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const {theme} = useTheme();
  const [hoveredSlice, setHoveredSlice] = useState<hoverDataType>(null);

  const handleSliceHover = useCallback((slice: any) => {
    // Sort points by probability (highest first)
    const sortedPoints = [...slice.points].sort(
      (a: any, b: any) => Number(b.data.y) - Number(a.data.y)
    );

    const sliceData = {
      date: String(slice.points[0].data.x),
      points: sortedPoints.map((point: any) => ({
        id: String(point.seriesId),
        data: point.data as graphDataPointType,
      })),
    };

    setHoveredSlice((prev) => {
      if (prev?.date !== sliceData.date) {
        return sliceData;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!data) return <></>;
  if (!data[0]) return <></>;

  // Series arrive most senior first. Nivo draws the first series on top, so
  // the senior apostles' lines sit above the juniors' and the grey line for a
  // future apostle sits at the bottom.
  const series = colorSeries(data);

  const timeYearResult = timeYear.every(1);
  if (!timeYearResult?.range) return <></>;
  const tickValuesAxisBottom = timeYearResult.range(
    new Date(series[0].data[0].x),
    new Date(series[0].data[series[0].data.length - 1].x)
  );

  return (
    <div className="flex flex-col h-full w-full">
      <div className="w-full h-[50vh] md:flex-1 md:min-h-[250px] lg:min-h-[500px] lg:min-w-[800px] relative">
        <DesktopLegend data={series} hoverData={hoveredSlice} />
        <ResponsiveLine
          data={series}
          margin={
            isMobile
              ? {top: 10, right: 10, bottom: 40, left: 40}
              : isTablet
              ? {top: 30, right: 20, bottom: 45, left: 50}
              : {top: 50, right: 25, bottom: 50, left: 60}
          }
          xScale={{
            format: '%Y-%m-%d',
            type: 'time',
            min: 'auto',
            max: 'auto',
          }}
          yScale={{type: 'linear', stacked: false, min: 'auto', max: 'auto'}}
          yFormat=" >-.2%"
          curve="natural"
          axisTop={null}
          axisBottom={{
            tickValues: isMobile
              ? tickValuesAxisBottom.filter((_, i) => i % 2 === 0)
              : tickValuesAxisBottom,
            tickSize: 5,
            tickPadding: 5,
            tickRotation: isMobile ? -45 : 0,
            format: timeFormat('%Y'),
            legend: isMobile ? '' : 'Year',
            legendOffset: 36,
            legendPosition: 'middle',
          }}
          axisLeft={{
            tickValues: isMobile
              ? [0, 0.25, 0.5, 0.75, 1]
              : [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: (value) => `${value * 100}%`,
            legend: isMobile ? '' : 'Prophet Probability',
            legendOffset: isMobile ? -35 : -40,
            legendPosition: 'middle',
          }}
          enableGridX={false}
          colors={{datum: 'color'}}
          lineWidth={isMobile ? 2 : 1}
          enablePoints={false}
          pointSize={4}
          pointColor={{theme: 'background'}}
          pointBorderWidth={1}
          pointBorderColor={{from: 'serieColor'}}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[]}
          theme={{
            tooltip: {
              container: {
                background: theme === 'dark' ? '#1e293b' : 'white',
                border:
                  theme === 'dark' ? '1px solid #475569' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '12px',
                maxWidth: '20rem',
                maxHeight: '80vh',
                overflow: 'auto',
                color: theme === 'dark' ? '#f1f5f9' : '#000',
              },
            },
            axis: {
              ticks: {
                text: {
                  fill: theme === 'dark' ? '#cbd5e1' : '#374151',
                },
              },
              legend: {
                text: {
                  fill: theme === 'dark' ? '#cbd5e1' : '#374151',
                },
              },
            },
            grid: {
              line: {
                stroke: theme === 'dark' ? '#334155' : '#e5e7eb',
              },
            },
          }}
          tooltip={() => null}
          enableSlices="x"
          sliceTooltip={({slice}) => {
            // Use setTimeout to defer state update until after render
            setTimeout(() => handleSliceHover(slice), 0);
            // Return null to hide the tooltip
            return null;
          }}
        />
      </div>
      <MobileLegend data={series} hoverData={hoveredSlice} />
    </div>
  );
}
