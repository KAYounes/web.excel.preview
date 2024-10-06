export const readFile = (file, parser) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;

      try {
        const parsedData = parser(data); // Use the provided parser function
        resolve(parsedData); // Resolve the promise with parsed data
      } catch (error) {
        reject(error); // Reject the promise in case of an error
      }
    };

    reader.onerror = (error) => reject(error);

    reader.readAsBinaryString(file); // Read the file as binary
  });
};
