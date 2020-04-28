import { useState } from "react";

export default () => {
  const [isVisible, setIsVisible] = useState(false);

  const showModal = async (child) => {
    setIsVisible(true);
  };

  const closeModal = async () => {
    setIsVisible(false);
  };

  return { showModal, closeModal, isVisible };
};
