import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';

interface radioProps {
    id: string
    label: string
    disabled: boolean
    onChange?: Function
    hidden?: boolean
    value: string
}

interface radios {
    radios: Array<radioProps>
    defaultValue?: string
    onChange?: Function
    required?: boolean
    description: string
    row?: boolean
    loading?: boolean;
    hidden?: boolean
}

export default forwardRef(({loading = false, radios, defaultValue = '', onChange, required, description, row=false} : radios, ref) => {
    const [internalValue, setInternalValue] = useState<string>(defaultValue);
    const [rowValue, setRowValue] = useState<boolean>(row);
    const titleOriginal = description
    const [titleDinamic, setTitleDinamic] = useState<string>(description);
    const [error, setError] = useState(false);

    const showMsgValid = (valid: boolean, msg: string) => {
        if (!valid) {
            setError(true)
            setTitleDinamic(msg)
        } else {
            setError(false)
            setTitleDinamic(titleOriginal)
        }
    }

    const validate = (value: string) => {
        let valid = true;
        let msg = ''

        if (!value && required) {
            valid = false
            msg = `El campo radio es ${'isRequired'}`
        }

        return {
            valid,
            msg
        }
    }

    const validateAndChage = (newValue: string) => {
        const {valid, msg} = validate(newValue)
        showMsgValid(valid, msg)
        setInternalValue(newValue);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        validateAndChage(newValue)
        
        onChange ? onChange(newValue) : null
    }

    const getValue = () => {
        return internalValue;
    }

    const validateField = () => {
        const val = validate(internalValue as string)
        showMsgValid(val.valid, val.msg)
        return val
    }

    useImperativeHandle(ref, () => ({
        validateField,
        getValue
    }));

    return loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Skeleton del título */}
            <Skeleton variant="text" width={120} height={24} />

            {/* Skeleton por cada radio */}
            {radios.filter(radio => (!radio.hidden)).map((_, key) => (
                <div 
                    key={key} 
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width={100} height={24} />
                </div>
            ))}
        </div>
    ) :  (
        <Tooltip title={titleDinamic} arrow>
            <FormControl>
                <FormLabel id="demo-radio-buttons-group-label"
                    sx={{
                        color: error ? 'red' : 'inherit',
                    }}
                >
                    {description}{required ? '*' : null}
                </FormLabel>
                <RadioGroup
                    row={rowValue}
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={internalValue}
                    onChange={handleChange} 
                >   
                    {
                        radios.map((radio, key) => {
                            if (!radio.hidden) {
                                return (
                                    <FormControlLabel 
                                        key={key}
                                        disabled={radio.disabled}
                                        value={radio.value}
                                        label={radio.label} 
                                        control={
                                            <Radio/>
                                        } 
                                    />
                                )
                            }
                        })
                    }
                </RadioGroup>
            </FormControl>
        </Tooltip>
    )
})

