import { useEffect } from "react";

const DeploymentGuide = () => {
  useEffect(() => {
    // Redirect to the static HTML file
    window.location.href = "/deployment-guide.html";
  }, []);

  return null;
};

export default DeploymentGuide;