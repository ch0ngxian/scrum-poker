import * as React from "react";
const SvgComponent = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1}
    className="feather feather-chevron-down"
    {...props}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export default SvgComponent;
