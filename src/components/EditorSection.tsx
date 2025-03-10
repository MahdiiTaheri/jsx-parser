"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Editor from "@monaco-editor/react";
import { Clipboard, Check } from "lucide-react";
import Loading from "./Loading";

interface EditorSectionProps {
  title: string;
  language: string;
  value: string;
  onChange: (value: string) => void;
  enableCopy?: boolean;
  height?: string;
}

const EditorSection: React.FC<EditorSectionProps> = ({
  title,
  language,
  value,
  onChange,
  enableCopy = false,
  height = "500px",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 border border-slate-700 rounded-lg relative">
      <div className="p-2 border-b border-slate-700 bg-slate-800 text-sm">
        {title}
      </div>
      {enableCopy && (
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-1.5 right-4 bg-sky-600 text-white px-3 py-1 rounded-md hover:bg-sky-700 transition-all duration-300 cursor-pointer"
        >
          {copied ? <Check size={14} /> : <Clipboard size={14} />}
        </motion.button>
      )}
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(val) => onChange(val || "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 16,
          autoClosingBrackets: "always",
          autoIndent: "advanced",
          automaticLayout: true,
          trimAutoWhitespace: true,
        }}
        loading={<Loading />}
      />
    </div>
  );
};

export default EditorSection;
