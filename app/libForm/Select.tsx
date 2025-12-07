import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';

interface option {
    label: string
    value: any
}

interface selectProps {
    id: string
    label: string
    title: string
    disabled: boolean
    error?: boolean
    defaultValue?: string
    onChange?: Function
    required?: boolean
    options: Array<option>
    loading?: boolean;
}

interface modelSelect {
    validateField: Function
    getValue: Function
}

export default forwardRef(({ loading = false, required = false, defaultValue = '', id, label, disabled,  onChange, title, options }: selectProps, ref) => {
    // const [ready, setReady] = useState(false);
    // useEffect(() => setReady(true), []);
    // if (!ready) return null;

    const [internalValue, setInternalValue] = useState<string>(defaultValue);
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');

    const validateField = () => {
        const val = validate(internalValue as any)
        showMsgValid(val.valid, val.msg)
        return val
    }

    const getValue = () => {
        return internalValue;
    }

    const validate = (value: string) => {
        let valid = true;
        let msg = ''
        if (value === '' && required) {
            valid = false
            msg = `El campo ${label} es requerido`
            // msg = `${t('theField')} ${label} ${t('isRequired')}`
        }

        return {
            valid,
            msg
        }
    }

    const showMsgValid = (valid: boolean, msg: string) => {
        if (!valid) {
            setError(true)
            setHelperText(msg)
        } else {
            setError(false)
            setHelperText('')
        }
    }

    const validateAndChage = (newValue: string) => {
        const {valid, msg} = validate(newValue)
        showMsgValid(valid, msg)
        setInternalValue(newValue);
    }
    
    const handleChange = (e: SelectChangeEvent) => {
        const newValue = e.target.value
        validateAndChage(newValue)
        
        onChange ? onChange(newValue) : null
    }

    useImperativeHandle(ref, () => ({
        validateField,
        getValue
    }));

    return loading ? (
        <Skeleton
            variant="rectangular"
            width="100%"
            height={56} // 👈 mismo alto que el Select
            sx={{ borderRadius: 1 }}
        />
    ) : (
        <Tooltip title={title} arrow>
            <FormControl error={error} disabled={disabled} required={required} fullWidth>
                <InputLabel id={`label-${id}`}>{label}</InputLabel>
                <Select
                    labelId={`label-${id}`}
                    id={id}
                    name={id}
                    value={internalValue}
                    label={label}
                    onChange={handleChange}
                    renderValue={(value: any) => `⚠️  - ${value}`}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {options.map((option: option, key: number) => {
                        return (
                            <MenuItem value={option.value} key={key}>{option.label}</MenuItem>
                        )
                    })}
                </Select>
                {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
            </FormControl>
        </Tooltip>
    )
})

export type {modelSelect, option};

