import React from 'react';
import styles from './Button10.module.css'; // Adjust the import path as necessary

const Button10 = ({ onClick, children }) => {
  return (
    <button className={styles['button-10']} role="button" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button10;
