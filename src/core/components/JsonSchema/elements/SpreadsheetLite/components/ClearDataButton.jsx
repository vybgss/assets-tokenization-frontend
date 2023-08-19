import React from 'react';
import { useTranslate } from 'react-translate';
import { Tooltip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from 'components/ConfirmDialog';
import { ChangeEvent } from 'components/JsonSchema';

const ClearDataButton = ({
  onChange,
  actions = {},
  disabled
}) => {
  const t = useTranslate('Elements');
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Tooltip title={t('ClearData')}>
        <IconButton
          onClick={() => setOpen(true)}
          disabled={disabled}
          size="large"
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <ConfirmDialog
        open={open}
        title={t('ClearData')}
        description={t('ClearDataPrompt')}
        handleClose={() => setOpen(false)}
        handleConfirm={async () => {
          setOpen(false);
          await onChange(new ChangeEvent(null, true));
          actions.clearErrors && actions.clearErrors();
        }}
      />
    </>
  );
};

export default ClearDataButton;