import { motion } from "motion/react";
import { Brain } from "lucide-react";
import { M } from "../../constants/fonts";

export function AskAIFab({ onClick }) {
    return (<motion.button onClick={onClick} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} className="fixed bottom-8 right-[408px] flex items-center gap-2.5 px-6 py-4 rounded-full z-30 shadow-[0_10px_30px_rgba(0,0,0,0.15)] border" style={{ background: "#ffd54a", borderColor: "#ffd54a" }}>
      <Brain size={18} style={{ color: "#735c00" }}/>
      <span className="font-bold text-[#735c00] text-[15px]" style={{ fontFamily: M }}>Ask AI</span>
    </motion.button>);
}
