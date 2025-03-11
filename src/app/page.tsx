"use client";

import { useState } from "react";
import { motion } from "motion/react";
import EditorSection from "@/components/EditorSection";
import ConversionControls from "@/components/ConversionControl";
import { parseJSXToJSON } from "../parser/index";
import { convertJSONToJSX } from "../parser/reverse";
import { toast } from "sonner";
import { INPUT_PLACEHOLDER, OUTPUT_PLACEHOLDER } from "@/constants";

const URL = "https://sdui.kalabazzar.ir/api/pages";

const ConverterPage: React.FC = () => {
  const [input, setInput] = useState<string>(INPUT_PLACEHOLDER);
  const [conversionType, setConversionType] = useState<string>("jsx-to-json");
  const [output, setOutput] = useState<string>(OUTPUT_PLACEHOLDER);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleConvert = async () => {
    if (!input.trim()) return;
    setIsPending(true);
    try {
      if (conversionType === "jsx-to-json") {
        const result = parseJSXToJSON(input);
        setOutput(JSON.stringify(result, null, 2));
      } else {
        const json = JSON.parse(input);
        const result = await convertJSONToJSX(json);
        setOutput(result);
      }
    } catch (err) {
      if (err instanceof Error)
        toast.error(err.message || "Conversion failed", {
          style: {
            backgroundColor: "oklch(0.936 0.032 17.717)",
            color: "oklch(0.577 0.245 27.325)",
          },
        });
    } finally {
      setIsPending(false);
    }
  };
  const handleSendJsonQuery = async () => {
    setIsCreating(true);
    try {
      const response = await fetch(`${URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ output }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      console.log("Response data:", data);
    } catch (error) {
      console.log("Error sending JSON query:", error);
      toast.error("Failed to create page", {
        style: {
          backgroundColor: "oklch(0.936 0.032 17.717)",
          color: "oklch(0.577 0.245 27.325)",
        },
      });
    } finally {
      setIsCreating(false);
    }
  };
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
      <div className="max-w-6xl mx-auto">
        <ConversionControls
          conversionType={conversionType}
          setConversionType={setConversionType}
          handleConvert={handleConvert}
          isPending={isPending}
          inputValue={input}
          handleSendJsonQuery={handleSendJsonQuery}
          isCreating={isCreating}
        />

        <div className="flex flex-col md:flex-row gap-4">
          <EditorSection
            title="Input"
            language={conversionType === "jsx-to-json" ? "javascript" : "json"}
            value={input}
            onChange={setInput}
            enableCopy={true}
            height="500px"
            isPending={isPending}
            initialPosition="left"
          />
          <EditorSection
            title="Output"
            language={conversionType === "jsx-to-json" ? "json" : "javascript"}
            value={output}
            onChange={setOutput}
            enableCopy={true}
            height="500px"
            isPending={isPending}
            initialPosition="right"
          />
        </div>
        <button
          onClick={handleSendJsonQuery}
          className=" mt-5 px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg disabled:opacity-50 transition-all duration-300 cursor-pointer active:scale-90"
        >
          send query
        </button>
      </div>
    </div>
  );
};

export default ConverterPage;
