import React from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import AceEditor from 'react-ace';
import { useTranslate } from 'react-translate';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import { TextField, Typography, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import InputAdornment from '@mui/material/InputAdornment';
import BPMN_AI_LOGO from 'assets/icons/BPMN_AI_icon.svg';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import 'react-resizable/css/styles.css';
import { getAiPrompts } from 'actions/bpmnAi';
import { addMessage } from 'actions/error';
import Message from 'components/Snackbars/Message';
import ProgressLine from 'components/Preloader/ProgressLine';
import classNames from 'classnames';
import config from 'config';

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 1000,
    padding: 0
  },
  editorOpen: {
    bottom: 84
  },
  header: {
    cursor: 'move',
    padding: 5,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  actionsWrapper: {
    width: '100%',
    textAlign: 'center'
  },
  contentRoot: {
    padding: 8,
    overflow: 'scroll'
  },
  question: {
    backgroundColor: '#33353f',
    padding: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#fff',
    marginLeft: -8,
    marginRight: -8,
    paddingBottom: '1.5rem',
    paddingTop: '1.5rem'
  },
  answer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingBottom: '1.5rem',
    marginTop: '1.5rem',
    '& > svg': {
      marginRight: 5,
      marginLeft: 5
    }
  },
  actionsRoot: {
    marginBottom: 0,
    paddingTop: 40,
    backgroundColor: '#343541'
  },
  dialogRoot: {
    position: 'absolute',
    right: 24,
    bottom: 140,
    zIndex: 1000,
    display: 'none',
    backgroundColor: '#444654'
  },
  dialogRootOpen: {
    display: 'block'
  },
  answerIcon: {
    backgroundColor: 'rgb(16, 163, 127)',
    padding: '0.25rem',
    lineHeight: 1,
    borderRadius: '0.125rem',
    marginRight: 20,
    '& > svg': {
      fill: '#fff',
      color: '#fff'
    }
  },
  searchInput: {
    background: '#40414f',
    marginBottom: 5,
    '& > div': {
      borderRadius: '0.375rem'
    },
    '& > fieldset': {
      border: 'none'
    }
  },
  telegramIcon: {
    fill: '#8c8d96',
    color: '#8c8d96',
    '& > svg': {
      width: 16,
      height: 16
    }
  },
  accountIcon: {
    marginRight: 20,
    fontSize: 42,
    position: 'relative',
    left: -2
  },
  regenerateButton: {
    marginBottom: 8,
    color: '#d9d9e3',
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    textTransform: 'inherit',
    border: '1px solid #565869',
    '& > svg': {
      marginRight: 8
    }
  },
  errorMessage: {
    fontSize: '.75rem',
    lineHeight: '1rem',
    marginBottom: 5
  },
  errorText: {
    color: '#ef4444'
  },
  copyToClipboardWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'relative',
    top: 15
  },
  answerMessage: {
    wordBreak: 'break-word'
  },
  editorWrapper: {
    marginBottom: 20
  }
}));

const AnswerIcon = () => {
  const classes = useStyles();

  return (
    <div className={classes.answerIcon}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 41 41"
        fill="#fff"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  );
};

const RenewIcon = () => {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      stroke-width="1.5"
      viewBox="0 0 24 24"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-3 w-3"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline points="1 4 1 10 7 10"></polyline>
      <polyline points="23 20 23 14 17 14"></polyline>
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
    </svg>
  );
};

const TelegramIcon = () => {
  const classes = useStyles();

  return (
    <div className={classes.telegramIcon}>
      <svg
        width="16"
        height="16"
        stroke="currentColor"
        fill="none"
        stroke-width="2"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    </div>
  );
};

const FOOTER_HEIGHT = 350;

const BpmnAi = ({ functionEditorData }) => {
  const [open, setOpen] = React.useState(false);
  const [height, setHeight] = React.useState(window.innerHeight - FOOTER_HEIGHT);
  const [width, setWidth] = React.useState(window.innerHeight - FOOTER_HEIGHT);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [lastKeyword, setLastKeyword] = React.useState('');

  const dispatch = useDispatch();
  const classes = useStyles();
  const t = useTranslate('BpmnAi');

  const handleOpen = () => setOpen(!open);

  const onResize = (event) => {
    setHeight(height + event.movementY);
    setWidth(width + event.movementX);
  };

  const handleChange = ({ target: { value } }) => setSearch(value);

  const handleSearch = async (props) => {
    if (loading) return;

    const regenerate = props?.regenerate;

    setLoading(true);

    setError(null);

    if (!regenerate) {
      setLastKeyword(search);
    }

    const response = await getAiPrompts({
      modelName: 'openaiModelApplicantInfo',
      promptText: regenerate ? lastKeyword || search : search
    })(dispatch);

    console.log(response);

    setLoading(false);

    if (response instanceof Error) {
      setError(response);
    }

    results.push({
      withError: response instanceof Error,
      keyWords: search,
      response
    });

    setResults(results);

    setSearch('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 4));
    dispatch(addMessage(new Message(t('Copied'), 'success')));
  };

  if (!['development', 'stage'].includes(config?.application?.environment)) {
    return null;
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        className={classNames({
          [classes.root]: true,
          [classes.editorOpen]: functionEditorData
        })}
      >
        <img src={BPMN_AI_LOGO} alt="bpmn ai icon" />
      </IconButton>

      <Draggable handle="strong">
        <div
          className={classNames({
            [classes.dialogRoot]: true,
            [classes.dialogRootOpen]: open
          })}
        >
          <Resizable height={height} width={width} onResize={onResize}>
            <>
              <strong>
                <div className={classes.header}>
                  <IconButton onClick={handleOpen}>
                    <CloseIcon />
                  </IconButton>
                </div>
              </strong>

              <div className={classes.contentRoot}>
                <DialogContentText height={`${height}px`} width={`${width}px`}>
                  {results.map(({ keyWords, response, withError }) => {
                    return (
                      <>
                        <div className={classes.question} id={keyWords}>
                          <AccountBoxIcon width="22" height="22" className={classes.accountIcon} />
                          <span>{keyWords}</span>
                        </div>

                        {response.payload ? (
                          <div className={classes.copyToClipboardWrapper}>
                            <Tooltip title={t('Copy')}>
                              <IconButton
                                className={classes.copyToClipboard}
                                onClick={() => copyToClipboard(response.payload)}
                              >
                                <ContentCopyIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                        ) : null}

                        <div className={classes.answer}>
                          <AnswerIcon />
                          {withError ? (
                            <Typography className={classes.errorText}>
                              {response.message}
                            </Typography>
                          ) : (
                            <Typography className={classes.answerMessage}>
                              {response.message}
                            </Typography>
                          )}
                        </div>

                        {!withError ? (
                          <div className={classes.editorWrapper}>
                            <AceEditor
                              value={JSON.stringify(response.payload, null, 4)}
                              mode="javascript"
                              theme="twilight"
                              fontSize={14}
                              width="100%"
                              highlightActiveLine={true}
                              wrapEnabled={true}
                              readOnly={true}
                              setOptions={{
                                showLineNumbers: true,
                                tabSize: 4,
                                highlightActiveLine: true,
                                useWorker: false
                              }}
                            />
                          </div>
                        ) : null}
                      </>
                    );
                  })}
                </DialogContentText>
              </div>

              <div
                className={classNames({
                  [classes.contentRoot]: true,
                  [classes.actionsRoot]: true
                })}
              >
                <div className={classes.actionsWrapper}>
                  {error ? (
                    <>
                      <Typography className={classes.errorMessage}>{error.message}</Typography>
                      <Button
                        onClick={() => handleSearch({ regenerate: true })}
                        variant="outlined"
                        className={classes.regenerateButton}
                      >
                        <RenewIcon />
                        {t('Regenerate')}
                      </Button>
                    </>
                  ) : null}
                  <TextField
                    value={search}
                    onChange={handleChange}
                    onKeyPress={({ key }) => key === 'Enter' && handleSearch()}
                    className={classes.searchInput}
                    placeholder={t('StartType')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleSearch}>
                            <TelegramIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <ProgressLine loading={loading} />
                </div>
              </div>
            </>
          </Resizable>
        </div>
      </Draggable>
    </>
  );
};

export default BpmnAi;
