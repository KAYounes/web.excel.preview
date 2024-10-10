'use client';
import FileInput from '@/components/FileInput';
import React from 'react';

export default function Home() {
  const [excel, setExcel] = React.useState();
  // const workbook = writeXLSX.read(file);

  return (
    <main
      style={{
        margin: '1em',
      }}>
      <FileInput onChange={() => console.log('change')} />
    </main>
  );
}
