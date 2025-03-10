"use client";

import { useState } from "react";
import { motion } from "motion/react";
import EditorSection from "@/components/EditorSection";
import ConversionControls from "@/components/ConversionControl";
import { parseJSXToJSON } from "../parser/index";
import { convertJSONToJSX } from "../parser/reverse";
import { toast } from "sonner";

const ConverterPage: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [conversionType, setConversionType] = useState<string>("jsx-to-json");
  const [output, setOutput] = useState<string>("");
  // const [error, setError] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleConvert = () => {
    if (!input.trim()) return;
    setIsPending(true);
    // setError("");
    try {
      if (conversionType === "jsx-to-json") {
        const result = parseJSXToJSON(input);
        setOutput(JSON.stringify(result, null, 2));
      } else {
        const json = JSON.parse(input);
        const result = convertJSONToJSX(json);
        setOutput(result);
      }
    } catch (err) {
      if (err instanceof Error) toast.error(err.message || "Conversion failed");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <motion.h1
        className="text-4xl font-bold text-sky-400 text-center mb-4 mt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        JSX & JSON Converter
      </motion.h1>
      <div className="max-w-6xl mx-auto">
        <ConversionControls
          conversionType={conversionType}
          setConversionType={setConversionType}
          handleConvert={handleConvert}
          isPending={isPending}
          inputValue={input}
        />
        {/* {error && (
          <motion.p
            className="mb-4 p-3 bg-rose-900 text-rose-300 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.p>
        )} */}
        <div className="flex flex-col md:flex-row gap-4">
          <EditorSection
            title="Input"
            language={conversionType === "jsx-to-json" ? "javascript" : "json"}
            value={input}
            onChange={setInput}
            enableCopy={true}
            height="500px"
          />
          <EditorSection
            title="Output"
            language={conversionType === "jsx-to-json" ? "json" : "javascript"}
            value={output}
            onChange={setOutput}
            enableCopy={true}
            height="500px"
          />
        </div>
      </div>
    </div>
  );
};

export default ConverterPage;
