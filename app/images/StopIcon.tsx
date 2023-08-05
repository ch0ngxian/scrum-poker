import * as React from "react";
const StopIcon = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
    <path
      fill="currentColor"
      d="M24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,12.955,35.045,4,24,4z M24,38	c-7.732,0-14-6.268-14-14s6.268-14,14-14s14,6.268,14,14S31.732,38,24,38z"
    />
    <polygon fill="currentColor" points="13.371,38.871 9.129,34.629 34.629,9.129 38.871,13.371" />
  </svg>
);
export default StopIcon;
