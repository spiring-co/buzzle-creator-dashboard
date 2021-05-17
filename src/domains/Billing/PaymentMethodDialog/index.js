import React, { useEffect, useRef, useState } from "react";
import {
    Dialog, DialogTitle, Button, DialogActions, DialogContent
} from "@material-ui/core";
import PaymentCard from "../PaymentCard";

export default ({ onClose, invoice = false }) => {
    return (<>
        <Dialog
            disableBackdropClick={true}

            onClose={onClose} aria-labelledby="simple-dialog-title" open={true}>
            <DialogContent style={{ padding: 30 }}>
                <PaymentCard
                    pendingInvoice={invoice}
                    mode="update"
                    onComplete={onClose}
                />
            </DialogContent>
        </Dialog>
    </>)
}