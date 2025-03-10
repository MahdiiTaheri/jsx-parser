import { motion } from "motion/react";

interface ConversionControlsProps {
  conversionType: string;
  setConversionType: (value: string) => void;
  handleConvert: () => void;
  isPending: boolean;
  inputValue: string;
}

const ConversionControls: React.FC<ConversionControlsProps> = ({
  conversionType,
  setConversionType,
  handleConvert,
  isPending,
  inputValue,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
      <select
        className="p-2 bg-slate-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
        value={conversionType}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setConversionType(e.target.value)
        }
      >
        <option value="jsx-to-json">JSX to JSON</option>
        <option value="json-to-jsx">JSON to JSX</option>
      </select>
      <button
        onClick={handleConvert}
        disabled={!inputValue.trim() || isPending}
        className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg disabled:opacity-50 transition-all duration-300 cursor-pointer active:scale-90"
      >
        {isPending ? "Converting..." : "Convert"}
      </button>
    </div>
  );
};

export default ConversionControls;
