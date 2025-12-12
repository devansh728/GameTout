import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star } from "lucide-react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

export const KonamiEasterEgg = () => {
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [isActivated, setIsActivated] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const newSequence = [...inputSequence, e.code].slice(-KONAMI_CODE.length);
      setInputSequence(newSequence);

      if (newSequence.join(",") === KONAMI_CODE.join(",")) {
        triggerEasterEgg();
      }
    },
    [inputSequence]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const triggerEasterEgg = () => {
    setIsActivated(true);
    setShowOverlay(true);

    // Play sound effect
    try {
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleVH/Wq7D7sB9FPlQqt3/41UAAExcktbs9atUAD9fnt3/8WMAD0pukc7s8oVXCjxfmt3/8GMACEpujsvo8IJXCDxfmt3+8WMACEpui8jj7n1VBjxgnd7/8mUCCktvi8bi7HtTBDxhnt/+82gEDU1xjMbg6nhRATtint/+9GkGD09zjsbg6XZOADpint/+9GoHEFFzjsXe6HNMBjpint/+9WoHEFF0jsXe53FKCTpint/+9WoHEFF0jsXe5nBICjpint/+9WoHEFF0jsXe5m9HCzphnt/+9WoHEFF0jsXe5m9GDDphnt/+9WsHEVJ1jsXe5m5FDTphnt/+9WsHEVJ1jsXe5m5EDjphnt/+9WsHEVJ1jsbe5m1DDztiod/+9WsHEVJ1jcXe5mxCEDtiod/+9WsHEVJ1jcXe5mxBETxjot/+9WsHEVJ1jcXe5ms/Ejxjot/+9WsHEVJ1jcXe5ms+Ez1kot/+9WsHEVJ1jcXe5mo9FD1kot/+9WsGEFF0jMTc5Gk7FT1kot/+9GkFD09yjMTc42g5Fj5lot/+82cDDExwi8Pa4WY3Fz9mo9/+8mQCCUlti8PZ4GQzGEBnpN/+8WIACEhrisbW3GAvGUFopd/+72AAB0dqh8PT2VwrGkJppd/97l0ABkVnhcDQ1lgmG0NqpuH/7FoABUNlg73M0VQhHERrp+L/6VgABEFig7rIzU8dHkVsp+P/5lYAA0Bhg7jFykscH0Zsp+T/5FQAAj5fg7fDyEkbIEdtqOT/4lIAAj1eg7XBxUYZIUhuqeX/4FEAAjxdg7S/w0QXIkluqeX/31AAAjxdg7O+wUMVJElvquX/3lAAAjxdg7K8v0ATJUpwq+b/3U8AATtcg7G7vT4SJkpxq+f/3E4AATtcg7C6uz0RJ0tyq+f/204AATtcg7C5uTwQKEtzrOf/2k4AATtcg6+4tzoPKkx0rOj/2k0AATtcg664tTkOK0x1rej/2U0AATtcg624tDgNLE12rej/2EwAATpbgq24szYMLU13ruj/10wAATpbgq23sjULLk54r+j/1ksAATpbgq23sTQJL094r+n/1UsAATpbgq22sDMIMFB5sOn/1EoAATpbgq21rzIHMVB5sOn/00oAATpbgq20ri8GMVF6son/0kkAATpbgq2zrS4FMlF6s+n/0UkAATpbgq2yrC0EMlJ7s+n/0EgAATpbgq2xqywDM1J7tOn/z0gAATpbgq2wqisDNFJ8tOn/zkgAATpbgq2wqSoCNVN8ten/zUcAATpbgq2vqCkBNlN9tun/zEcAATpbgq2upicANlR9t+n/y0YAATpbgq2tpSYAN1R+t+n/ykYAATpbgq2spCUAN1V+uOn/yUYAATpbgq2royQAN1V/uOn/yEUAATpbgq2qoSMAN1Z/uen/x0UAATpbgq2poCIAN1aAuun/xkQAATpbgq2onx8AOFeBu+n/xUQAATpbgq2nnR4AOFeButn/xEMAATpbgq2mnBwAOViBvOn/w0MAATpbgq2lmxsAOViCvOn/wkIAATpbgq2kmRoAOlmCven/wUIAATpbgq2jlxgAOlmDvun/wEEAATpbgq2ilhcAO1qDv+n/v0EAATpbgq2hlRYAO1qEv+n/vkAAATpbgq2fkxQAPFuEwOn/vUAAATpbgq2ekRMAP")
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {}

    // Invert colors temporarily
    document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
    
    setTimeout(() => {
      document.documentElement.style.filter = "";
    }, 3000);

    setTimeout(() => {
      setShowOverlay(false);
    }, 4000);
  };

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          {/* Stars Explosion */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0, rotate: 0 }}
              animate={{
                scale: [0, 1, 0.5],
                x: (Math.random() - 0.5) * window.innerWidth,
                y: (Math.random() - 0.5) * window.innerHeight,
                rotate: Math.random() * 720,
              }}
              transition={{ duration: 2, delay: i * 0.05 }}
              className="absolute"
            >
              <Star
                className="w-8 h-8 text-primary fill-primary"
                style={{ filter: "drop-shadow(0 0 10px hsl(43 100% 50%))" }}
              />
            </motion.div>
          ))}

          {/* Mission Passed Banner */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: "spring", damping: 10 }}
            className="relative"
          >
            <div
              className="px-16 py-8 rounded-lg bg-gradient-to-r from-green-600 to-green-500"
              style={{
                boxShadow: "0 0 100px rgba(34, 197, 94, 0.5)",
              }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Trophy className="w-10 h-10 text-yellow-300" />
                  <h2 className="font-display text-5xl text-white">
                    MISSION PASSED!
                  </h2>
                  <Trophy className="w-10 h-10 text-yellow-300" />
                </div>
                <p className="text-green-100 text-xl">
                  +500 RESPECT
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
