"use client";

import { useEffect } from "react";

export function AutoPrint() {
  useEffect(() => {
    const id = window.setTimeout(() => {
      window.print();
    }, 150);

    return () => window.clearTimeout(id);
  }, []);

  return null;
}
