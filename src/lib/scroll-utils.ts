/**
 * Sets sessionStorage flag to scroll to a specific section on homepage after navigation
 * @param sectionId The ID of the section to scroll to (e.g., "blog", "gallery", "videos", "book")
 */
export const setHomeScrollTarget = (sectionId: string) => {
  sessionStorage.setItem("homeScrollTarget", sectionId);
};

/**
 * Gets the target section from sessionStorage and clears it
 * @returns The section ID to scroll to, or null if not set
 */
export const getAndClearHomeScrollTarget = (): string | null => {
  const target = sessionStorage.getItem("homeScrollTarget");
  if (target) {
    sessionStorage.removeItem("homeScrollTarget");
  }
  return target;
};

/**
 * Scrolls to a section by ID with smooth behavior
 * @param sectionId The ID of the section to scroll to
 */
export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
