
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // The result is a data URL: "data:image/png;base64,iVBORw0KGgo..."
      // We only need the base64 part.
      const base64String = result.split(',')[1];
      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error("Could not extract base64 string from file."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
