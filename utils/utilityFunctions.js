// utilityFunctions.js

export const toTitlecase = (str) => {
    if (!str || typeof str !== "string") return "";
    
    return str
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter and make the rest lowercase
      .join(" "); // Join the words back into a single string
  };
  