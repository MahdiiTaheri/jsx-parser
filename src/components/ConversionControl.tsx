import { motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import Loading from "./Loading";

const ConversionControls: React.FC<ConversionControlsProps> = ({
  conversionType,
  setConversionType,
  handleConvert,
  isPending,
  inputValue,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4"
    >
      <Select value={conversionType} onValueChange={setConversionType}>
        <SelectTrigger className="dark:text-white text-secondary-foreground">
          <SelectValue placeholder="Select conversion" />
        </SelectTrigger>
        <SelectContent className="dark:bg-slate-800">
          <SelectItem value="jsx-to-json">JSX to JSON</SelectItem>
          <SelectItem value="json-to-jsx">JSON to JSX</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-4">
        <Button
          onClick={handleConvert}
          disabled={!inputValue.trim() || isPending}
          className="px-5 py-2 dark:bg-sky-600 dark:hover:bg-sky-700 text-white rounded-lg cursor-pointer active:scale-90"
        >
          {isPending ? <Loading /> : "Convert"}
        </Button>
      </div>
    </motion.div>
  );
};

export default ConversionControls;
