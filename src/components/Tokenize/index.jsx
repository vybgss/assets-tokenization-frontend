import React from "react";
import { useTranslate } from 'react-translate';
import makeStyles from '@mui/styles/makeStyles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import classNames from "classnames";
import CheckIcon from 'assets/images/Check_icon.svg';
import LoadingStep from "components/LoadingStep";

const styles = (theme) => ({
  divider: {
    height: 1,
    backgroundColor: 'rgba(233, 235, 241, 1)',
  },
  dialogTitle: {
    padding: '7px 16px',
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '27px',
    letterSpacing: '0em',
    backgroundColor: 'rgba(244, 243, 246, 1)',
    border: '1px solid rgba(233, 235, 241, 1)',
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 600,
      paddingRight: 0,
    }
  },
  dialogContent: {
    padding: 16,
    fontSize: 16,
    fontWeight: 400,
    lineHeight: '24px',
    marginBottom: 10,
    color: 'rgba(0, 0, 0, 1)',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: '21px',
      fontWeight: 600,
    }
  },
  dialogContentCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  dialogActions: {
    justifyContent: 'flex-start',
    padding: 16,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      '& button': {
        width: '100%',
        marginLeft: '0!important',
        marginBottom: 10,
      }
    }
  },
  dialogContentTitle: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '27px',
    color: 'rgba(0, 0, 0, 1)',
    marginBottom: 10,
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
      lineHeight: '24px'
    }
  },
  dialogContentText: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: '24px',
    color: 'rgba(89, 89, 89, 1)',
    marginBottom: 30,
    marginLeft: 60,
    marginRight: 60,
    maxWidth: 550,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: '21px',
      marginBottom: 15,
      marginLeft: 0,
      marginRight: 0
    }
  },
  removeMargin: {
    margin: 0
  },
  dialogProcessingButton: {
    marginBottom: 40,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 0,
      marginTop: 5
    }
  },
  successLogo: {
    width: 80,
    height: 80,
    margin: '0 auto',
    marginBottom: 10,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 0,
      width: 56,
      height: 56,
    }
  },
  dialogTitleSuccess: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 8,
    [theme.breakpoints.down('sm')]: {
      padding: 0
    }
  },
  closeIcon: {
    width: 40,
    height: 40,
    [theme.breakpoints.down('sm')]: {
      width: 24,
      height: 24
    }
  }
});

const useStyles = makeStyles(styles);

const Tokenize = ({
  tokenize,
  setTokenize,
  onSuccess
}) => {
  const [step, setStep] = React.useState('intro');
  const t = useTranslate('TokenizeScreen');
  const classes = useStyles();

  const handleClose = () => {
    setTokenize(false);
    setTimeout(() => setStep('intro'), 250);
  };

  const handleSuccess = () => {
    handleClose();
    onSuccess(tokenize);
  };
  return (
    <Dialog
      open={!!tokenize}
    >
      {
        step === 'intro' ? (
          <>
            <DialogTitle
              classes={{
                root: classes.dialogTitle
              }}
            >
              {t('Title')}
              <IconButton
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent
              classes={{
                root: classes.dialogContent
              }}
            >
              <DialogContentText
                classes={{
                  root: classNames({
                    [classes.dialogContentText]: true,
                    [classes.removeMargin]: true
                  })
                }}
              >
                {t("TokenizeText")}
              </DialogContentText>
            </DialogContent>

            <div className={classes.divider} />

            <DialogActions
              classes={{
                root: classes.dialogActions
              }}
            >
              <Button
                variant="contained"
                onClick={() => setStep('processing')}
              >
                {t("Tokenize")}
              </Button>

              <Button
                onClick={handleClose}
              >
                {t("Cancel")}
              </Button>
            </DialogActions>
          </>
        ) : null
      }

      {
        step === 'processing' ? (
          <LoadingStep
            title={t("TokenizeProcessingTitle")}
            description={t("TokenizeProcessingDescription")}
            actionText={t('CancelProcessing')}
            onClick={() => setStep('success')}
          />
        ) : null
      }

      {
        step === 'success' ? (
          <>
            <DialogTitle
              classes={{
                root: classNames(
                  classes.dialogTitleSuccess
                )
              }}
            >
              <IconButton
                onClick={handleClose}
              >
                <CloseIcon
                  className={classes.closeIcon}
                />
              </IconButton>
            </DialogTitle>

            <img
              src={CheckIcon}
              alt="headline_logo"
              className={classes.successLogo}
            />

            <DialogContent
              classes={{
                root: classNames(
                  classes.dialogContent,
                  classes.dialogContentCenter
                )
              }}
            >
              <DialogContentText
                classes={{
                  root: classes.dialogContentTitle
                }}
              >
                {t("SuccessTitle")}
              </DialogContentText>
              <DialogContentText
                classes={{
                  root: classes.dialogContentText
                }}
              >
                {t("SuccessDescription")}
              </DialogContentText>
              <Button
                variant="contained"
                className={classes.dialogProcessingButton}
                onClick={handleSuccess}
              >
                {t('EditObject')}
              </Button>
            </DialogContent>
          </>
        ) : null
      }

    </Dialog>
  );
};

export default Tokenize;
