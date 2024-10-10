import react from 'react';
import styles from './fileInput.module.css';
import { Merriweather } from 'next/font/google';

const font = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
});

function FileInput(props) {
  return (
    <input
      {...props}
      type='File'
      className={styles.fileInput + ' ' + font.className}
    />
  );
}

export default FileInput;
