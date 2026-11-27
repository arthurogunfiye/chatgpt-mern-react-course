import { useState } from 'react';

export default function useToggle(initialValue = false) {
  // TODO 1:
  // Create a state variable named isOpen.
  // Create its setter named setIsOpen.
  // Initialise it using initialValue.
  const [isOpen, setIsOpen] = useState(initialValue);
  // TODO 2:
  // Create a function named toggle.
  // It should reverse the current Boolean state
  // using a functional state update.
  function toggle() {
    setIsOpen(prevState => !prevState);
  }
  // TODO 3:
  // Return an object containing:
  // isOpen and toggle.
  return { isOpen, toggle };
}
