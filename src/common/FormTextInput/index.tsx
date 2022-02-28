import { Box, Chip, TextField, TextFieldProps } from "@material-ui/core"
import { SmallText } from "common/Typography"
import React, { useEffect, useState } from "react"
import { FieldInterface } from "services/buzzle-sdk/types"
type IProps = {
    mode: "preview" | "form",
    value?: string
    onBlur?: (name: string, touched: boolean) => void,
    onChange?: (name: string, value: string) => void,
    onError?: (name: string, message: string) => void,
    helperText?: string,
    name: string,
    otherProps?: TextFieldProps,
    tags?: React.ReactNode
}
export default ({ mode, label, tags, type, constraints = {}, onBlur, value = "", onChange,
    helperText = "", onError,
    name, placeholder, rendererData, key, otherProps = {} }: IProps & FieldInterface) => {
    const { required = false, maxLength } = constraints
    const { layerName } = rendererData
    const [input, setInput] = useState<string>((mode === "form" ? value : placeholder) || "")
    const handleBlur = (e: any) => {
        onBlur && onBlur(name || key, true)
    }
    const handleChange = (e: any) => {
        setInput(e?.target?.value || "")
    }
    useEffect(() => {
        onChange && onChange(name || key, input)
    }, [input])
    return <Box key={key} style={{ display: 'flex', flexDirection: 'column' }}>
        {mode === "preview" ? <Box style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip color="primary" style={{
                fontSize: 12, height: 20,
                alignSelf: 'flex-start',
                marginRight: 10, marginBottom: 15
            }} label={`Field Preview for ${layerName}`} size="small" />
            {tags ? tags : <div />}
        </Box> : <div />}
        <TextField label={label}
            style={{ alignSelf: 'flex-start' }}
            required={required}
            value={input}
            onBlur={handleBlur}
            helperText={mode === "form" ? helperText : required ? "* Field required" : ""}
            onChange={handleChange}
            defaultValue={placeholder} placeholder={placeholder}
            inputProps={{
                ...(maxLength ? { maxLength } : {})
            }}
            InputProps={{
                endAdornment: <SmallText color="textSecondary">{`${input.length}/${maxLength}`}</SmallText>
            }}
            {...otherProps}
        />
    </Box>
}