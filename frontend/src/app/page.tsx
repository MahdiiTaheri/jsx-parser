"use client";

import { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Clipboard, Check, RotateCw } from "lucide-react";

const ConverterPage = () => {
  const [input, setInput] = useState("");
  const [conversionType, setConversionType] = useState("jsx-to-json");
  const [copied, setCopied] = useState(false);

  const { mutate, isPending, isError, isSuccess, data, error } = useMutation({
    mutationKey: ["convert", conversionType],
    mutationFn: () =>
      axios
        .post(`${process.env.NEXT_PUBLIC_APP_URL}/${conversionType}`, input)
        .then((res) => res.data),
  });

  const handleConvert = () => {
    if (!input.trim()) return;
    mutate();
  };

  const handleCopy = () => {
    if (!data) return;
    const formattedData =
      conversionType === "json-to-jsx"
        ? formatJSX(data)
        : JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(formattedData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatJSX = (data: unknown) => {
    const jsxString = typeof data === "string" ? data : JSON.stringify(data);
    return jsxString.replace(/></g, ">\n<").replace(/\s{2,}/g, "  ");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900 text-white">
      <motion.h1
        className="text-4xl font-bold mb-8 text-sky-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        JSX & JSON Converter
      </motion.h1>

      <motion.div
        className="w-full max-w-2xl p-6 bg-slate-800 text-gray-200 rounded-lg shadow-2xl space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <textarea
            className="w-full text-sm p-3 border rounded-lg bg-slate-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            rows={8}
            placeholder="Enter JSON or JSX here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="flex gap-4 items-center justify-between">
            <select
              className="p-2 border rounded-lg bg-slate-700 text-gray-200 focus:ring-2 focus:ring-sky-500 cursor-pointer"
              value={conversionType}
              onChange={(e) => setConversionType(e.target.value)}
            >
              <option value="jsx-to-json">JSX to JSON</option>
              <option value="json-to-jsx">JSON to JSX</option>
            </select>

            <button
              onClick={handleConvert}
              disabled={!input.trim() || isPending}
              className={`px-5 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 transition-all duration-300 ${
                !input.trim() ? "cursor-not-allowed" : "cursor-pointer"
              } flex items-center gap-2`}
            >
              {isPending ? (
                <>
                  <RotateCw className="animate-spin" size={16} />
                  Converting...
                </>
              ) : (
                "Convert"
              )}
            </button>
          </div>
        </div>

        {isError && (
          <motion.p
            className="text-rose-300 mt-4 p-3 bg-rose-900 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {error?.message || "Conversion failed"}
          </motion.p>
        )}

        {isSuccess && (
          <motion.div
            className="relative mt-6 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <pre className="p-4 bg-slate-700 text-gray-200 rounded-lg overflow-auto text-sm max-h-80">
              {conversionType === "json-to-jsx"
                ? formatJSX(data)
                : JSON.stringify(data, null, 2)}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-5 bg-sky-600 text-white p-2 rounded-lg flex items-center gap-1 hover:bg-sky-700 transition-all duration-300 cursor-pointer"
            >
              {copied ? <Check size={12} /> : <Clipboard size={12} />}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ConverterPage;
