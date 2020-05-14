import React from "react";
import RecoPreview from "./../RecoPreview/RecoPreview";

const Recommendations = (recommendations) => {
  return (
    <>
      {recommendations.map((reco, index) => (
        <RecoPreview recommendation={reco} key={index} />
      ))}
    </>
  );
};
export default Recommendations;
