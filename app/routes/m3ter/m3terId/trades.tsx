import {
  ArrowRightLeft,
  Scroll,
  SendHorizontal,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { formatAddress } from "~/lib/utils";
import type { Route } from "./+types/trades";
import { M3terHead } from "m3ters";

const trades = (m3terId: string) => {
  return [
    {
      id: 1,
      from: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      to: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      amount: 0.5,
      icon: ArrowRightLeft,
      fromId: m3terId,
      toId: (Number(m3terId) + Math.floor(Math.random() * 30) + 1).toString(),
    },
    {
      id: 2,
      from: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      to: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      amount: 0.75,
      icon: Scroll,
      fromId: m3terId,
      toId: (Number(m3terId) + Math.floor(Math.random() * 30) + 1).toString(),
    },
    {
      id: 3,
      from: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      to: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      amount: 1.0,
      icon: ShoppingCart,
      fromId: m3terId,
      toId: (Number(m3terId) + Math.floor(Math.random() * 30) + 1).toString(),
    },
    {
      id: 4,
      from: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      to: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      amount: 0.25,
      icon: SendHorizontal,
      fromId: m3terId,
      toId: (Number(m3terId) + Math.floor(Math.random() * 30) + 1).toString(),
    },
    {
      id: 5,
      from: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      to: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      amount: 0.5,
      icon: ArrowRightLeft,
      fromId: m3terId,
      toId: (Number(m3terId) + Math.floor(Math.random() * 30) + 1).toString(),
    },
    {
      id: 6,
      from: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      to: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      amount: 0.9,
      icon: SendHorizontal,
      fromId: m3terId,
      toId: (Number(m3terId) + Math.floor(Math.random() * 30) + 1).toString(),
    },
    {
      id: 7,
      from: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      to: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      amount: 1.3,
      icon: ShoppingCart,
      fromId: m3terId,
      toId: (Number(m3terId) + Math.floor(Math.random() * 30) + 1).toString(),
    },
    {
      id: 8,
      from: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      to: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      amount: 0.65,
      icon: Scroll,
      fromId: m3terId,
      toId: (Number(m3terId) + Math.floor(Math.random() * 30) + 1).toString(),
    },
    {
      id: 9,
      from: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      to: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      amount: 0.42,
      icon: ArrowRightLeft,
      fromId: m3terId,
      toId: (Number(m3terId) + Math.floor(Math.random() * 30) + 1).toString(),
    },
    {
      id: 10,
      from: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      to: "0x386888AB83c7f2ac174e3eFfB75d39578733E0e6",
      amount: 2.0,
      icon: ArrowRightLeft,
      fromId: m3terId,
      toId: (Number(m3terId) + Math.floor(Math.random() * 30) + 1).toString(),
    },
  ];
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function Trades({ params }: Route.ComponentProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleTrades = showAll
    ? trades(params.m3terId)
    : trades(params.m3terId).slice(0, 5);
  console.log(trades(params.m3terId));
  return (
    <section className="flex flex-col items-center justify-center p-4 pb-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-[var(--background-primary)] p-4 rounded-xl w-full md:max-w-max shadow-lg"
      >
        <h3 className="mb-4 text-lg font-semibold">Trades</h3>

        <ul className="space-y-4">
          <AnimatePresence initial={false}>
            {visibleTrades.map((trade) => (
              <motion.li
                key={trade.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                layout
                className="rounded-xl flex items-center justify-between gap-10 px-2 py-2 border-[1.5px] border-[var(--background-secondary)]  "
              >
                <div className="flex flex-col gap-1 items-center">
                  <M3terHead size={20} seed={trade.fromId} />
                  <span className="text-xs text-center">
                    <span className="block md:hidden">
                      {formatAddress(trade.from)}
                    </span>
                    <span className="hidden md:block">{trade.from}</span>
                  </span>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="text-xl">
                    <trade.icon />
                  </div>
                  <span className="text-sm">{trade.amount} Eth</span>
                </div>

                <div className="flex flex-col gap-1 items-center">
                  <M3terHead size={20} seed={trade.toId} />
                  <span className="text-xs text-center">
                    <span className="block md:hidden">
                      {formatAddress(trade.to)}
                    </span>
                    <span className="hidden md:block">{trade.to}</span>
                  </span>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {trades.length > 5 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mt-4"
          >
            <button
              className="text-sm "
              onClick={() => setShowAll((prev) => !prev)}
            >
              <a>{showAll ? "See less" : "See more"}</a>
            </button>
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}

export default Trades;
