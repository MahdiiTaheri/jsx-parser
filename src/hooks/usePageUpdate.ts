"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

export function usePageUpdate(apiUrl: string, output: string) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updatePage = useCallback(async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ output }),
      });
      if (!response.ok) throw new Error("Network response was not ok");

      toast.success("Page updated", {
        style: {
          backgroundColor: "oklch(0.925 0.084 155.995)",
          color: "oklch(0.627 0.194 149.214)",
        },
      });
    } catch (error) {
      console.log("Error updating page:", error);
      toast.error("Failed to create page", {
        style: {
          backgroundColor: "oklch(0.936 0.032 17.717)",
          color: "oklch(0.577 0.245 27.325)",
        },
      });
    } finally {
      setIsUpdating(false);
    }
  }, [apiUrl, output]);

  return { updatePage, isUpdating };
}
