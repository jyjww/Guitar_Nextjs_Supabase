// Event handler to handle image click
export const handleImageClick = (setSelectedImage, category) => {
    setSelectedImage(category); // Update the selected image state
  };
  
  // Event handler to close the detail view
  export const handleCloseDetail = (setSelectedImage) => {
    setSelectedImage(null); // Close the detail view
  };
  
// utils/eventHandlers.js

export const handleImageClick2 = (setSelectedImage, item) => {
    setSelectedImage(item); // Update the state with the clicked item
  };
// Function to increment the quantity
export const handleIncrement = (quantity) => {
  return quantity + 1;
};

// Function to decrement the quantity (cannot go below 1)
export const handleDecrement = (quantity) => {
  return quantity > 1 ? quantity - 1 : 0;
};
