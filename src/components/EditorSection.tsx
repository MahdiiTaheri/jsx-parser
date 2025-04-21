"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { Clipboard, Check } from "lucide-react";
import Loading from "./Loading";
import { useTheme } from "next-themes";

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
  const { theme } = useTheme();

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
      className="flex-1 relative shadow border-b dark:border-slate-700 dark:bg-slate-800 bg-zinc-600 border-zinc-800 rounded-md"
    >
      <div className="p-2 font-semibold">{title}</div>
      {enableCopy && (
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-2 right-4 dark:bg-sky-600 bg-zinc-900 text-white px-3 py-1 rounded-md dark:hover:bg-sky-700 transition-all duration-300 cursor-pointer"
        >
          {copied ? <Check size={14} /> : <Clipboard size={14} />}
        </motion.button>
      )}
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(val) => onChange(val || "")}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: false },
          fontSize: 16,
          autoClosingBrackets: "always",
          automaticLayout: true,
          readOnly: isPending,
          formatOnPaste: true,
          wordWrap: "bounded",
        }}
        className={`${isPending ? "pointer-events-none" : ""} shadow-lg`}
        onMount={shouldFormatOnChange ? handleEditorDidMount : undefined}
        loading={<Loading />}
        beforeMount={(monaco) => {
          monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true,
          });
        }}
      />
    </motion.div>
  );
};

export default EditorSection;
