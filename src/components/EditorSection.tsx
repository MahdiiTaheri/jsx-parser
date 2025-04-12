"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { Clipboard, Check } from "lucide-react";
import Loading from "./Loading";

const EditorSection: React.FC<EditorSectionProps> = ({
  title,
  language,
  value,
  onChange,
  enableCopy = false,
  height = "500px",
  isPending,
  initialPosition,
  shouldFormatOnChange,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editor.onDidChangeModelContent(() => {
      const formatAction = editor.getAction("editor.action.formatDocument");
      if (formatAction) formatAction.run();
    });
  };

  return (
    <motion.div
      initial={{
        x:
          initialPosition === "left"
            ? -50
            : initialPosition === "right"
            ? 50
            : 0,
        opacity: 0,
      }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex-1 border-slate-700 rounded-lg relative"
    >
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
          automaticLayout: true,
          readOnly: isPending,
          formatOnPaste: true,
          wordWrap: "bounded",
        }}
        className={`${isPending ? "pointer-events-none" : ""}`}
        onMount={shouldFormatOnChange ? handleEditorDidMount : undefined}
        loading={<Loading />}
      />
    </motion.div>
  );
};

export default EditorSection;
