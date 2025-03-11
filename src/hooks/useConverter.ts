"use client";

import { useState, useTransition, useCallback } from "react";
import { parseJSXToJSON } from "../parser/index";
import { convertJSONToJSX } from "../parser/reverse";
import { toast } from "sonner";
import { OUTPUT_PLACEHOLDER } from "@/constants";

export const useConverter = () => {
  const [output, setOutput] = useState<string>(OUTPUT_PLACEHOLDER);
  const [isConverting, startTransition] = useTransition();

  const convert = useCallback(
    async (input: string, conversionType: string) => {
      if (!input.trim()) return;
      try {
        if (conversionType === "jsx-to-json") {
          const result = parseJSXToJSON(input);
          startTransition(() => {
            setOutput(JSON.stringify(result, null, 2));
          });
        } else {
          const json = JSON.parse(input);
          const result = await convertJSONToJSX(json);
          startTransition(() => {
            setOutput(result);
          });
        }
      } catch (err) {
        if (err instanceof Error)
          toast.error(err.message || "Conversion failed", {
            style: {
              backgroundColor: "oklch(0.936 0.032 17.717)",
              color: "oklch(0.577 0.245 27.325)",
            },
          });
      }
    },
    [startTransition]
  );

  return { output, convert, isConverting };
};
