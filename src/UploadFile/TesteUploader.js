import React, { useState } from 'react';
import uniqid from 'uniqid';
import { setInterval, clearInterval } from 'timers';
import { Uploader } from './Uploader';

export function TesteUploader() {
  const [files, setFiles] = useState({});

  function DummyUploader(copyFiles, uid) {
    const newCopyFile = copyFiles;
    const timer = setInterval(() => {
      newCopyFile[uid] = {
        file: newCopyFile[uid].file,
        completed: newCopyFile[uid].completed + Math.random() * 10,
        uprate: Math.random() * 10 * 1000,
        uploader: timer,
      };

      if (newCopyFile[uid].completed >= 100) {
        clearInterval(timer);
      }

      setFiles(newCopyFile);
    }, 800);
  }

  const onNewFiles = newFiles => {
    const copyFiles = { ...files };
    newFiles.forEach(file => {
      const uid = uniqid();
      copyFiles[uid] = {
        file,
        completed: 0,
        uprate: Math.random() * 10 * 1000,
        uploader: null,
      };

      setFiles(copyFiles);

      DummyUploader(copyFiles, uid);
    });
  };

  const onDeleteFiles = fileIndex => {
    const copyFiles = { ...files };

    // Note: Before update the state (excluding),
    // this example should stop the upload process (dummy here)
    clearInterval(copyFiles[fileIndex].uploader);

    // Update state
    delete copyFiles[fileIndex];
    setFiles(copyFiles);
  };

  return (
    <Uploader
      value={files}
      dropzoneText="Arraste ou selecione seus arquivos de upload"
      onChange={onNewFiles}
      filesLimit={10}
      onDelete={onDeleteFiles}
    />
  );
}
