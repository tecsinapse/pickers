import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { Snackbar } from '../Notifications/Snackbar';
import { convertBytes } from './helper';
import { Button } from '../Buttons/Button';

const useStyle = makeStyles({
  root: {
    // borderStyle: 'dashed',
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    // border: '2px dashed blue',
    // borderRadius: '6px',
    // backgroundColor: '#80808021',
    // flexBasis: '40%',
  },
  dropzone: {
    width: '100%',
    height: '100%',
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    // border: '2px dashed grey',
    // flexBasis: '25%',
  },
  icon: {
    // /border: '2px dashed blue',
    alignSelf: 'center',
    height: '60%',
    width: '60%',
    // flexBasis: '25%',
  },
  textDiv: {
    // border: '2px dashed green',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flexBasis: '40%',
  },
  button: {
    // border: '2px dashed blue',
    alignSelf: 'center',
    width: '55%',
  },
  divider: {
    width: '25%',
    alignSelf: 'center',
    marginBottom: '4%',
    marginTop: '1%',
    // border: '1px dashed blue',
  },
  buttonDiv: {
    alignSelf: 'center',
    // border: '2px dashed green',
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
  buttonIcon: {
    marginRight: '5%',
  },
  text: {
    marginBottom: '1%',
  },
  iconColor: {
    color: '#61616152',
  },
});

export function Uploader({
  value,
  acceptedFormat,
  filesLimit,
  maxFileSize,
  title,
  buttonLabel,
  onAccept,
  onReject,
  subtitle,
}) {
  const [snackbar, setSnackBar] = useState({
    show: false,
    variant: 'error',
    msg: '',
  });
  const classes = useStyle();

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: acceptedFormat.join(','),
    maxSize: maxFileSize,
    onDrop: acceptedFiles => {
      // The limit only counts uploading file (no error and no completed)
      if (
        acceptedFiles.length +
          Object.keys(value).filter(
            i => !value[i].error && !(value[i].completed >= 100)
          ).length <=
        filesLimit
      ) {
        if (onAccept) onAccept(acceptedFiles);
      } else {
        setSnackBar({
          show: true,
          variant: 'error',
          msg: `Maximum allowed number of files exceeded. Only ${filesLimit} allowed`,
        });
        if (onReject)
          onReject(
            acceptedFiles.map(file => ({
              file,
              error: 'Maximum allowed number of files',
            }))
          );
      }
    },
    onDropRejected: rejectedFiles => {
      let message = '';
      const errorFile = [];
      rejectedFiles.forEach(rejectedFile => {
        let messageFile = '';
        message += `${rejectedFile.name} failed. `;
        if (!acceptedFormat.includes(rejectedFile.type)) {
          messageFile += 'File type not supported. ';
        }
        if (rejectedFile.size > maxFileSize) {
          messageFile += `Size limit ${convertBytes(maxFileSize)}.`;
        }
        if (messageFile === '') messageFile = 'Undefined error';
        errorFile.push({ file: rejectedFile, error: messageFile });
      });
      setSnackBar({
        show: true,
        variant: 'error',
        msg: message,
      });
      if (onReject && errorFile.length > 0) onReject(errorFile);
    },
  });

  const rootProps = getRootProps({
    // Disable click and keydown behavior
    onClick: event => event.stopPropagation(),
    onKeyDown: event => {
      if (event.keyCode === 32 || event.keyCode === 13) {
        event.stopPropagation();
      }
    },
  });
  return (
    <React.Fragment>
      <div {...rootProps} className={classes.root}>
        <input {...getInputProps()} />
        <div className={classes.dropzone}>
          <div className={classes.textDiv}>
            <CloudUploadIcon
              fontSize="large"
              color="primary"
              className={classes.icon}
              classes={{ colorPrimary: classes.iconColor }}
            />
            <Typography variant="h5" color="textSecondary">
              {title}
            </Typography>
          </div>

          <div className={classes.divider}>
            <Divider variant="middle" />
          </div>

          <div className={classes.buttonDiv}>
            <Typography
              variant="body2"
              className={classes.text}
              color="textSecondary"
            >
              {subtitle}
            </Typography>
            <Button
              variant="secondary"
              size="large"
              onClick={open}
              className={classes.button}
            >
              <CloudUploadIcon className={classes.buttonIcon} />
              {buttonLabel}
            </Button>
          </div>
        </div>
      </div>
      <Snackbar
        show={snackbar.show}
        variant={snackbar.variant}
        onClose={() => setSnackBar({ show: false, variant: 'error' })}
      >
        {snackbar.msg}
      </Snackbar>
    </React.Fragment>
  );
}

Uploader.defaultProps = {
  value: {},
  acceptedFormat: ['image/*', 'video/*', 'application/*'],
  filesLimit: 3,
  maxFileSize: 3000000,
  title: 'Drag and drop a file',
  buttonLabel: 'Upload Files',
  onAccept: null,
  onReject: null,
  subtitle: 'or click on the button',
};

Uploader.propTypes = {
  acceptedFormat: PropTypes.array,
  filesLimit: PropTypes.number,
  maxFileSize: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  buttonLabel: PropTypes.string,
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  value: PropTypes.shape({
    uid: PropTypes.number,
    file: PropTypes.object,
    completed: PropTypes.number,
    uprate: PropTypes.number,
    error: PropTypes.string,
  }),
};