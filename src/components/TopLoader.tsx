import NextTopLoader from "nextjs-toploader";
import React from "react";

export default function TopLoader() {
  return (
    <NextTopLoader
      color="#00B252"
      initialPosition={0.08}
      crawlSpeed={200}
      height={2}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      //   shadow="0 0 10px #006E33,0 0 5px #006E33"
      template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
      zIndex={1600}
      showAtBottom={false}
    />
  );
}
