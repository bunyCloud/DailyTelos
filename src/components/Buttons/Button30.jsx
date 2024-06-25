// Button30.js
import React from 'react';
import styles from './Button30.module.css';

const Button30 = ({ onClick, children }) => {
  return (
    <button className={styles['button-30']} role="button" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button30;
