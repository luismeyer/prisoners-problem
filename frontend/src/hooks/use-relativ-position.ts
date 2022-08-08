import { RefObject, useMemo } from "react";

export type ChildRef = {
  number: number;
  ref: HTMLDivElement;
};

export type Locations = Record<number, { top: number; left: number }>;

export const useRelativePositions = (
  parenRef: RefObject<HTMLElement>,
  children: React.MutableRefObject<ChildRef[]>
) => {
  const relativeLocations = useMemo((): Locations => {
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
