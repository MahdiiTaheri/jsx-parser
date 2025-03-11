"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import EditorSection from "@/components/EditorSection";
import ConversionControls from "@/components/ConversionControl";
import { INPUT_PLACEHOLDER } from "@/constants";
import { useConverter } from "@/hooks/useConverter";
import { usePageUpdate } from "@/hooks/usePageUpdate";

const DEFAULT_URL =
  "https://sdui.kalabazzar.ir/api/pages?path=admin:/dashboard/test";

const ConverterPage: React.FC = () => {
  const [apiUrl, setApiUrl] = useState<string>(DEFAULT_URL);
  const [input, setInput] = useState<string>(INPUT_PLACEHOLDER);
  const [conversionType, setConversionType] = useState<string>("jsx-to-json");

  const { output, convert, isConverting } = useConverter();
  const { updatePage, isUpdating } = usePageUpdate(apiUrl, output);

  const handleConvert = useCallback(() => {
    convert(input, conversionType);
  }, [input, conversionType, convert]);

  const handleSendJsonQuery = useCallback(() => {
    updatePage();
  }, [updatePage]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <motion.h1
        className="text-2xl lg:text-4xl font-bold text-sky-400 text-center mb-4 mt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        JSX & JSON Converter
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-6xl mx-auto mb-4"
      >
        <label htmlFor="apiUrl" className="block mb-1">
          Route
        </label>
        <input
          id="apiUrl"
          type="text"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          className="w-full max-w-lg p-2 rounded-lg bg-slate-800 text-white"
        />
      </motion.div>
      <div className="max-w-6xl mx-auto">
        <ConversionControls
          conversionType={conversionType}
          setConversionType={setConversionType}
          handleConvert={handleConvert}
          isPending={isConverting}
          inputValue={input}
          handleSendJsonQuery={handleSendJsonQuery}
          isUpdating={isUpdating}
          apiUrl={apiUrl}
        />
        <div className="flex flex-col md:flex-row gap-4">
          <EditorSection
            title="Input"
            language={conversionType === "jsx-to-json" ? "javascript" : "json"}
            value={input}
            onChange={setInput}
            enableCopy={true}
            height="500px"
            isPending={isConverting}
            initialPosition="left"
          />
          <EditorSection
            title="Output"
            language={conversionType === "jsx-to-json" ? "json" : "javascript"}
            value={output}
            onChange={() => {}}
            enableCopy={true}
            height="500px"
            isPending={isConverting}
            initialPosition="right"
          />
        </div>
      </div>
    </div>
  );
};

export default ConverterPage;
