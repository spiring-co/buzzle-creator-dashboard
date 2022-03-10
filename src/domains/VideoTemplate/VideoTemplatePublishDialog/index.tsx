import React, { useContext, useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import PublishSteps from "./PublishSteps";
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Text } from "common/Typography"
import { TransitionProps } from '@material-ui/core/transitions';
import { VideoTemplate, Pricing } from 'services/buzzle-sdk/types';
import { SubHeading } from 'common/Typography';
import RenderTimeStep from './RenderTimeStep';
import LoyaltyAmountStep from './LoyaltyAmountStep';
import { useAPI } from 'services/APIContext';
import { useAuth } from 'services/auth';
import ApproveStep from './ApproveStep';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }),
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
type IProps = {
  handleClose: Function,
  data: VideoTemplate,
  pricing?: Array<Pricing>,
  onDone: (data: VideoTemplate) => void,
}
export default ({ handleClose, data, onDone, ...props }: IProps) => {
  const classes = useStyles();
  const isRepublish = data?.rejectionReason && data.publishState === 'rejected'
  const { user } = useAuth()
  const [activeStep, setActiveStep] = useState(0);
  const [pricing, setPricing] = useState<Array<Pricing>>(props?.pricing || [])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const { Pricing } = useAPI()
  useEffect(() => {
    if (pricing.length === 0) {
      fetchPricing()
    } else {
      setLoading(false)
    }
  }, [])
  const fetchPricing = async () => {
    try {
      setError(null)
      setLoading(true)
      setPricing(await Pricing.video(data.id || "","",{duration:'all'}))
      setLoading(false)
    } catch (err) {
      setError(err as Error)
      setLoading(false)
    }
  }
  const onRequestClose = () => {
    handleClose()
  }
  const navigateToNextStep = () => {
    setActiveStep(1)
  }
  const handleBacPress = () => {
    setActiveStep(0)
  }
  const onSubmit = (data: VideoTemplate) => {
    onDone(data)
  }
  const renderStep = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <RenderTimeStep
            pricing={pricing}
            data={data} handleSubmit={navigateToNextStep} />
        );
      case 1:
        return (
          <LoyaltyAmountStep data={data}
            onBackPress={handleBacPress} handlePublish={onSubmit} />
        );
      default:
        return;
    }
  };

  return (<Dialog fullScreen open={true} onClose={onRequestClose}
    TransitionComponent={Transition}>
    <AppBar className={classes.appBar}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onRequestClose} aria-label="close">
          <CloseIcon />
        </IconButton>
        <SubHeading className={classes.title}>
          {user?.role === "admin" ? "Approve Template" : isRepublish ? "Re-Apply for review" : "Apply for review"}
        </SubHeading>
      </Toolbar>
    </AppBar>
    <Paper elevation={0}>
      {loading || error !== null ? <Box style={{
        minHeight: 200, display: 'flex', width: '100%',
        flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        {error ? <>
          <Text color="textSecondary" >{error?.message}</Text>
          <Button size="small" children="retry"
            color="secondary"
            variant="contained"
            style={{ marginTop: 10 }}
            onClick={fetchPricing} />
        </> : <CircularProgress color="primary" size={25} />}
      </Box> : user?.role === "admin" ? <ApproveStep pricing={pricing}
        data={data}
        onSubmit={onSubmit} /> : <PublishSteps activeStep={activeStep} renderStep={renderStep} />}
    </Paper>
  </Dialog>
  );
}