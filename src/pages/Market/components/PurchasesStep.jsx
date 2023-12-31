import React from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Fade from '@mui/material/Fade';
import { Typography, TextField, Button } from '@mui/material';
import PageTitle from 'components/PageTitle';
import ListCard from 'components/ListCard';
import Card from 'components/Card';
import Stepper from 'components/Stepper';
import SnackBarWrapper from 'components/Snackbar';
import SuccessRegistration from 'components/SuccessRegistration';
import { ReactComponent as ArrowForwardIcon } from 'assets/images/arrowForwardWhite.svg';
import { ReactComponent as LockIcon } from 'assets/images/lock_icon.svg';
import { acceptDeal, checkMetaMaskState, weiToEth, changeOwner } from 'actions/contracts';
import store from 'store';

const PurchasesStep = ({
  t,
  classes,
  toDetailsObject,
  purchase,
  setPurchase,
  isSM,
  activeStep,
  setActiveStep,
  objects,
  onSuccess
}) => {
  const [offerError, setOfferError] = React.useState(null);
  const wallet = useSelector((state) => state?.profile?.userInfo?.wallet);
  const dispatch = useDispatch();

  const { dealInfo } = purchase || {}

  const handleAcceptOffer = React.useCallback(async () => {
    try {
      const metamaskState = await checkMetaMaskState();

      if (metamaskState !== 'connected') {
        setLoading(false);
        setOfferError(t(metamaskState));
        return;
      }

      const tx = await acceptDeal(purchase?.dealAddress, purchase?.dealInfo?.Price);

      if (!tx) return;

      await changeOwner(purchase?.id, wallet)(dispatch);

      setActiveStep(2);
    } catch (error) {
      setOfferError(t(error.message));
    }
  }, [setOfferError, t, purchase, setActiveStep, dispatch]);

  const redirectToHomeScreen = React.useCallback(() => {
    setPurchase(false);
    setActiveStep(0);
    onSuccess();
  }, [setPurchase, setActiveStep, onSuccess]);

  const renderStep = React.useMemo(
    () => (
      <Fade in={true}>
        <div>
          {purchase ? (
            <>
              <PageTitle>{t('PurchasesObjectTitle')}</PageTitle>

              <Card fullWidth={true}>
                <Typography className={classes.briefInfoTitle}>
                  {purchase?.address}
                </Typography>

                <div className={classes.cardDetails}>
                  <Typography className={classes.cardDetailsTitle}>
                    {t('BuildType', { value: purchase?.type })}
                    {!isSM ? <span className={classes.dot} /> : null}
                  </Typography>
                  <Typography className={classes.cardDetailsTitle}>
                    {t('BuildArea', { value: purchase?.totalArea })}
                    <span className={classes.dot} />
                  </Typography>
                  <Typography className={classes.cardDetailsTitle}>
                    {t('LivingArea', { value: purchase?.livingArea })}
                  </Typography>
                </div>
              </Card>

              <div className={classes.cardsWrapper}>
                <Card>
                  <Stepper
                    activeStep={activeStep}
                    steps={[
                      {
                        label: t('PurchasesStep1label'),
                        description: t('PurchasesStep1description')
                      },
                      {
                        label: t('PurchasesStep2label'),
                        description: t('PurchasesStep2description')
                      }
                    ]}
                  />
                </Card>

                <Card>
                  {activeStep === 0 ? (
                    <>
                      <Typography
                        className={classNames({
                          [classes.headline]: true,
                          [classes.mb32]: true
                        })}
                      >
                        {t('ObjectPaymentTitle')}
                      </Typography>

                      <Typography className={classes.fieldHeadline}>
                        {t('WalletTitle')}
                      </Typography>

                      <div
                        className={classNames({
                          [classes.relative]: true,
                          [classes.maxWidth]: true
                        })}
                      >
                        <TextField
                          value={dealInfo?.Shopper}
                          variant="outlined"
                          margin="normal"
                          placeholder={t('PricePlaceHolder')}
                          disabled={true}
                          className={classNames({
                            [classes.textfield]: true,
                            [classes.mb32]: true,
                            [classes.mb16Sm]: true,
                            [classes.disabledTextField]: true
                          })}
                        />
                        <LockIcon className={classes.lockIcon} />
                      </div>

                      <Typography className={classes.fieldHeadline}>
                        {t('SumToPay')}
                      </Typography>

                      <div
                        className={classNames({
                          [classes.relative]: true,
                          [classes.maxWidth]: true
                        })}
                      >
                        <TextField
                          value={weiToEth(dealInfo?.Price)}
                          variant="outlined"
                          margin="normal"
                          placeholder={t('PricePlaceHolder')}
                          disabled={true}
                          className={classNames({
                            [classes.textfield]: true,
                            [classes.disabledTextField]: true
                          })}
                        />

                        <LockIcon className={classes.lockIcon} />
                      </div>

                      <Typography
                        className={classNames({
                          [classes.fieldSample]: true,
                          [classes.mb32]: true,
                          [classes.mb16Sm]: true
                        })}
                      >
                        {t('SumToPaySample')}
                      </Typography>

                      <div
                        className={classNames({
                          [classes.actions]: true,
                          [classes.alignLeft]: true,
                          [classes.alignCenterSm]: true
                        })}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setPurchase(false);
                          }}
                          className={classNames({
                            [classes.mr16]: true
                          })}
                        >
                          {t('CancelProcessing')}
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAcceptOffer}
                        >
                          {t('ToPayment')}
                          <ArrowForwardIcon className={classes.actionIcon} />
                        </Button>
                      </div>
                    </>
                  ) : null}

                  {activeStep === 2 ? (
                    <SuccessRegistration
                      title={t('PurchasesSuccessTitle')}
                      description={t('PurchasesSuccessDescription')}
                      actionText={t('PurchasesSuccess')}
                      redirectToHomeScreen={redirectToHomeScreen}
                    />
                  ) : null}
                </Card>
              </div>
            </>
          ) : (
            <>
              <PageTitle>{t('PurchasesTitle')}</PageTitle>

              <>
                {objects.length ? (
                  <>
                    {objects.map((item, index) => (
                      <ListCard
                        item={item}
                        key={index}
                        openDetails={toDetailsObject}
                        price={item?.price}
                        mainAction={(number) => {
                          setPurchase(number);
                        }}
                        hideSecondaryAction={true}
                        mainActionText={t('StartPurchase')}
                        detailsLink={`/market/${item.id}`}
                      />
                    ))}
                  </>
                ) : (
                  <div className={classes.noResults}>{t('NoPurchasesText')}</div>
                )}
              </>
            </>
          )}
        </div>
      </Fade>
    ),
    [
      t,
      classes,
      toDetailsObject,
      purchase,
      setPurchase,
      isSM,
      activeStep,
      setActiveStep,
      objects,
      handleAcceptOffer,
      dealInfo,
      redirectToHomeScreen
    ]
  );

  return (
    <>
      {renderStep}
      <SnackBarWrapper onClose={() => setOfferError(false)} error={offerError} />
    </>
  );
};

export default PurchasesStep;
