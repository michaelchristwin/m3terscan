import { motion } from "motion/react";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

function Page() {
  const latitude = 9.0765;
  const longitude = 7.3986;

  return (
    <motion.div
      className="rounded-xl overflow-hidden shadow-md w-full h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Map
        mapLib={import("maplibre-gl")}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        style={{ width: "100%", height: "100%" }}
        initialViewState={{
          latitude,
          longitude,
          zoom: 10,
        }}
      >
        <Marker latitude={latitude} longitude={longitude} anchor="bottom">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#e74c3c"
            stroke="white"
            strokeWidth="2"
            width="32"
            height="32"
            style={{ transform: "translateY(-4px)" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21s-6-5.373-6-10a6 6 0 1 1 12 0c0 4.627-6 10-6 10z"
            />
            <circle cx="12" cy="11" r="2.5" fill="white" />
          </svg>
        </Marker>
      </Map>
    </motion.div>
  );
}

export default Page;
