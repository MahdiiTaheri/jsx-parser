import * as motion from "motion/react-client";
import Convert from "@/components/Convert";
import DarkmodeSwitch from "@/components/DarkmodeSwitch";

const ConverterPage = () => {
  return (
    <div className="relative min-h-screen dark:bg-slate-900 bg-gray-100 text-white p-4">
      <DarkmodeSwitch />

      <motion.h1
        className="text-2xl lg:text-4xl font-bold dark:text-sky-400 text-zinc-700 text-center mb-4 mt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        JSX & JSON Converter
      </motion.h1>

      <Convert />
    </div>
  );
};

export default ConverterPage;
