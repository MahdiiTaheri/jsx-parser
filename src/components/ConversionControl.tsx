import { motion } from "motion/react";

const ConversionControls: React.FC<ConversionControlsProps> = ({
  conversionType,
  setConversionType,
  handleConvert,
  isPending,
  inputValue,
  handleSendJsonQuery,
  isUpdating,
  apiUrl,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4"
    >
      <select
        className="max-w-fit px-5 py-2 bg-slate-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
        value={conversionType}
        onChange={(e) => setConversionType(e.target.value)}
      >
        <option value="jsx-to-json">JSX to JSON</option>
        <option value="json-to-jsx">JSON to JSX</option>
      </select>
      <div className="flex items-center gap-4">
        <button
          onClick={handleSendJsonQuery}
          disabled={!apiUrl?.trim() || isUpdating}
          className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg disabled:opacity-50 transition-all duration-300 cursor-pointer active:scale-90"
        >
          {isUpdating ? "Updating..." : "Update page"}
        </button>
        <button
          onClick={handleConvert}
          disabled={!inputValue.trim() || isPending}
          className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg disabled:opacity-50 transition-all duration-300 cursor-pointer active:scale-90"
        >
          {isPending ? "Converting..." : "Convert"}
        </button>
      </div>
    </motion.div>
  );
};

export default ConversionControls;
