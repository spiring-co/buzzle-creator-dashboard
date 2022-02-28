import React, { useContext, useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import LayerAdder from "../LayerAdder";
import VersionMeta from "../VersionMeta";
import VersionStepper from "../VersionStepper";
import CompositionPicker from "../CompositionPicker";
import VersionSampleField from "../VersionSampleField";
import { TransitionProps } from '@material-ui/core/transitions';
import useActions from 'contextStore/actions';
import { VideoTemplateContext } from 'contextStore/store';
import { VideoTemplate } from 'services/buzzle-sdk/types';
import { SubHeading } from 'common/Typography';

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
    isEdit: boolean,
    editIndex: number | null,
    compositions: any,
    onDone: Function
}
export default ({ handleClose, isEdit, compositions, editIndex, onDone }: IProps) => {
    const classes = useStyles();
    const [videoObj]: Array<VideoTemplate> = useContext(VideoTemplateContext);
    const [composition, setComposition] = useState<string>(isEdit ? videoObj.versions[editIndex as number]?.composition : "");
    const { editversionKeys } = useActions();
    const [activeVersionIndex, setActiveVersionIndex] = useState<number>(0);
    const [activeStep, setActiveStep] = useState(isEdit ? 1 : 0);
    const onRequestClose = () => {
        handleClose()
    }
    useEffect(() => {
        setActiveVersionIndex(videoObj.versions.length);
    }, [activeVersionIndex]);
    const openVersionMeta = () => {
        editversionKeys((isEdit ? editIndex : activeVersionIndex) as number, {
            composition,
        });
        setActiveStep(activeStep + 1);
    }
    const renderStep = (activeStep: number) => {
        switch (activeStep) {
            case 0:
                return (
                    <CompositionPicker
                        composition={composition}
                        setComposition={setComposition}
                        compositions={compositions}
                        openVersionMeta={openVersionMeta}
                    />
                );
            case 1:
                return (
                    <VersionMeta
                        onBack={() => {
                            setComposition(
                                videoObj?.versions[(isEdit ? editIndex : activeVersionIndex) as number]
                                    ?.composition
                            );
                            setActiveStep(activeStep - 1);
                        }}
                        onSubmit={(data: { title: string, description: string }) => {
                            editversionKeys((isEdit ? editIndex : activeVersionIndex) as number, {
                                title: data.title,
                                description: data.description,
                            });
                            setActiveStep(activeStep + 1);
                        }}
                        initialValue={{
                            title:
                                videoObj?.versions[(isEdit ? editIndex : activeVersionIndex) as number]
                                    ?.title,
                            description:
                                videoObj?.versions[(isEdit ? editIndex : activeVersionIndex) as number]
                                    ?.description,
                        }}
                    />
                );
            case 2:
                return (
                    <LayerAdder
                        onBack={() => setActiveStep(activeStep - 1)}
                        editVersion={isEdit}
                        compositions={compositions}
                        activeVersionIndex={(isEdit ? editIndex : activeVersionIndex) as number}
                        onSubmit={() => setActiveStep(activeStep + 1)}
                    />
                );
            case 3:
                return (
                    <VersionSampleField
                        onBack={() => setActiveStep(activeStep - 1)}
                        isEdit={isEdit}
                        editVersion={isEdit}
                        activeVersionIndex={(isEdit ? editIndex : activeVersionIndex) as number}
                        setActiveVersionIndex={setActiveVersionIndex}
                        openVersionDisplay={onDone}
                    />
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
                    {!isEdit ? "Add Version" : "Update Version"}
                </SubHeading>
            </Toolbar>
        </AppBar>
        <VersionStepper editVersion={isEdit} activeStep={activeStep} renderStep={renderStep} />
    </Dialog>
    );
}