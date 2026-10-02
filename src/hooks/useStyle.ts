import { useEffect, useState } from "react";

function useStyle(styleVar: string) {
  const [value, setValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const styleValue = styles.getPropertyValue(styleVar).trim();
    setValue(styleValue || undefined);
  }, [styleVar]);

  return value;
}

export default useStyle;
