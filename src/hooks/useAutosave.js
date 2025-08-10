import { useEffect } from "react";
import { saveData } from "../utils/storage";

export default function useAutosave(data, interval = 1200) {
  useEffect(() => {
    const t = setTimeout(() => {
      saveData(data);
    }, interval);
    return () => clearTimeout(t);
  }, [data, interval]);
}
