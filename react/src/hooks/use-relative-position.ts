import { RefObject, useCallback } from "react";
import { Location } from "../store/simulation";

export type ChildRef = {
  number: number;
  ref: HTMLDivElement;
};

export const useRelativeLocations = (
  parenRef: RefObject<HTMLElement>,
  children: React.MutableRefObject<ChildRef[]>
) => {
  const relativeLocations = useCallback((): Record<number, Location> => {
    if (!parenRef.current || !children.current) {
      return {};
    }

    return children.current.reduce((acc, boxRef) => {
      if (!parenRef.current) {
        return acc;
      }

      const parent = parenRef.current.getBoundingClientRect();
      const container = boxRef.ref.getBoundingClientRect();

      const left = container.left - parent.left;
      const top = container.top - parent.top;

      return {
        ...acc,
        [boxRef.number]: { left, top },
      };
    }, {});
  }, [parenRef.current, children.current]);

  return relativeLocations;
};
