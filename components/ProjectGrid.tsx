import { ReactNode } from "react";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
  default: 3,
  1023: 2,
  639: 1,
};

export const ProjectGrid = ({ children }: { children: ReactNode }) => {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="masonry-grid"
      columnClassName="masonry-grid-column"
    >
      {children}
    </Masonry>
  );
};
