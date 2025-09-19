import * as d3 from "d3";
import { useState } from "react";
import styles from "./demo.module.css";

type HeatmapProps = {
  width: number;
  height: number;
  data: { totalEnergy: number; week: number }[];
  nCols: number;
  nRows: number; // how many columns you want in the heatmap
};

export type InteractionData = {
  row: number;
  col: number;
  xPos: number;
  yPos: number;
  week: number;
  totalEnergy: number;
};

export const Demo = ({ width, height, data, nCols, nRows }: HeatmapProps) => {
  const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);

  return (
    <div style={{ position: "relative" }}>
      <Renderer
        nRows={nRows}
        width={width}
        height={height}
        data={data}
        nCols={nCols}
        setHoveredCell={setHoveredCell}
      />
      <Tooltip interactionData={hoveredCell} width={width} height={height} />
    </div>
  );
};

const MARGIN = { top: 10, right: 50, bottom: 30, left: 50 };

type RendererProps = {
  width: number;
  height: number;
  data: { totalEnergy: number; week: number }[];
  nCols: number;
  nRows: number;
  setHoveredCell: (hoveredCell: InteractionData | null) => void;
};

export const Renderer = ({
  width,
  height,
  data,
  nCols,
  nRows,
  setHoveredCell,
}: RendererProps) => {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  let [min = 0, max = 0] = d3.extent(data.map((d) => d.totalEnergy)); // get min/max
  if (min === max) {
    max = min + 1; // avoid collapsed domain
  }

  const colorScale = d3
    .scaleSequential()
    .domain([min, max])
    .interpolator(d3.interpolateRgb("#FBE6D4", "#EB822A"));

  const allShapes = data.map((value, i) => {
    const row = i % nRows;
    const col = Math.floor(i / nRows);

    const xScale = d3
      .scaleBand()
      .domain(d3.range(nCols).map(String))
      .range([0, boundsWidth])
      .padding(0.1);

    const yScale = d3
      .scaleBand()
      .domain(d3.range(nRows).map(String))
      .range([0, boundsHeight])
      .padding(0.1);

    const x = xScale(String(col)) as number;
    const y = yScale(String(row)) as number;
    const cellWidth = xScale.bandwidth();
    const cellHeight = yScale.bandwidth();

    return (
      <rect
        key={i}
        x={x}
        y={y}
        width={cellWidth}
        height={cellHeight}
        fill={colorScale(value.totalEnergy)}
        stroke="white"
        onMouseEnter={() =>
          setHoveredCell({
            row,
            col,
            xPos: x + cellWidth + MARGIN.left,
            yPos: y + cellHeight / 2 + MARGIN.top,
            totalEnergy: value.totalEnergy,
            week: value.week,
          })
        }
        onMouseLeave={() => setHoveredCell(null)}
        cursor="pointer"
      />
    );
  });

  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${MARGIN.left},${MARGIN.top})`}
      >
        {allShapes}
      </g>
    </svg>
  );
};

type TooltipProps = {
  interactionData: InteractionData | null;
  width: number;
  height: number;
};

const Tooltip = ({ interactionData, width, height }: TooltipProps) => {
  if (!interactionData) return null;

  return (
    <div
      style={{
        width,
        height,
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      <div
        className={styles.tooltip}
        style={{
          position: "absolute",
          left: interactionData.xPos,
          top: interactionData.yPos,
        }}
      >
        <TooltipRow label="Week" value={String(interactionData.week)} />
        <TooltipRow
          label="Revenue"
          value={(interactionData.totalEnergy * 0.6).toFixed(2)}
        />
      </div>
    </div>
  );
};

type TooltipRowProps = {
  label: string;
  value: string;
};

const TooltipRow = ({ label, value }: TooltipRowProps) => (
  <div>
    <b>{label}</b>
    <span>: </span>
    <span>{value}</span>
  </div>
);
