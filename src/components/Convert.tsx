"use client";

import { useCallback, useState } from "react";
import ConversionControls from "./ConversionControl";
import EditorSection from "./EditorSection";
import { INPUT_PLACEHOLDER } from "@/constants";
import { useConverter } from "@/hooks/useConverter";
import { motion } from "motion/react";

function Convert() {
  const [input, setInput] = useState<string>(INPUT_PLACEHOLDER);
  const [conversionType, setConversionType] = useState<string>("jsx-to-json");

  const { output, convert, isConverting } = useConverter();

  const handleConvert = useCallback(() => {
    convert(input, conversionType);
  }, [input, conversionType, convert]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="max-w-6xl mx-auto mb-4"
    >
      <div className="max-w-6xl mx-auto">
        <ConversionControls
          conversionType={conversionType}
          setConversionType={setConversionType}
          handleConvert={handleConvert}
          isPending={isConverting}
          inputValue={input}
          // handleSendJsonQuery={handleSendJsonQuery}
          // isUpdating={isUpdating}
          // apiUrl={apiUrl}
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
            shouldFormatOnChange={false}
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
            shouldFormatOnChange={true}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Convert;
