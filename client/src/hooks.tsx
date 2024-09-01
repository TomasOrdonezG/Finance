import React, { useState, useEffect } from "react";

export function useToggle(defaultValue: boolean = false): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(defaultValue);
  function toggle(): void {
    setValue(!value);
  }
  return [value, toggle];
}

export function useFetch<StateType>(
  defaultValue: StateType,
  getFunction: (...args: any) => Promise<StateType>,
  args: any[]
): [StateType, () => void, React.Dispatch<React.SetStateAction<StateType>>] {
  const [value, setValue] = useState<StateType>(defaultValue);
  const [refetchToggle, refetch] = useToggle();

  // Every time the parameters are changed, this hook will refetch the data
  useEffect(() => {
    (async () => {
      setValue(await getFunction(...args));
    })();
  }, [getFunction, ...args, refetchToggle]);

  return [value, refetch, setValue];
}
