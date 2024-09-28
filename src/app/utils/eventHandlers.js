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
export const handleIncrement = (setQuantity) => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };
  
  // Function to decrement the quantity (cannot go below 1)
export const handleDecrement = (setQuantity) => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

