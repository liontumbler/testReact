import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import FormLabel from '@mui/material/FormLabel';

//import "./styles.css";

// const fileTypes = ["JPEG", "PNG", "GIF"];

interface inputProps {
    id: string
    title: string
    fileTypes: Array<'JPEG' | 'PNG' | 'GIF'>
    loading?: boolean
    maxSize?: number
    minSize?: number
    defaultValue?: File[] | null
    required?: boolean
    disabled?: boolean
    label: string
    placeholder?: string
    onChange?: Function
    hidden?: boolean
}

export default forwardRef(({ loading = false, required = false, defaultValue = null, id, label, disabled = false, hidden = false, placeholder, onChange, minSize = 0.1, maxSize = 5, title, fileTypes }: inputProps, ref) => {
    const [file, setFile] = useState<File[] | null>(defaultValue);
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');

    const validateField = () => {
        const val = validate(file as File[])
        showMsgValid(val.valid, val.msg)
        return val
    }

    const getValue = () => {
        return file;
    }

    const validate = (value: File[]) => {
        let valid = true;
        let msg = ''
        if (value.length === 0 && required) {
            valid = false
            msg = `El campo ${label} es requerido`
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

    const validateAndChage = (newValue: File[]) => {
        const {valid, msg} = validate(newValue)
        showMsgValid(valid, msg)
        setFile(newValue);
    }

    const handleChange = (incoming: File | File[]) => {
        const filesArray = Array.isArray(incoming) ? incoming : [incoming];
        validateAndChage(filesArray)
        onChange ? onChange(filesArray) : null
    };

    const handleError = (err: any) => {
        console.log(err)
        validateAndChage([])
    }

    const handleErrorSize = (file: any) => {
        console.log(file)
        validateAndChage([])
    }

    return loading ? (
        <Skeleton
            variant="rectangular"
            width="100%"
            height={56} // alto típico de un TextField
            sx={{ borderRadius: 1 }}
        />
    ) : (
        !hidden ? 
        <Tooltip title={title} arrow>
            <div>
                <label
                    style={{
                        color: error ? 'red' : 'inherit',
                    }}
                >{label}{required ? '*' : null}</label>
                <FileUploader
                    multiple={true}
                    handleChange={handleChange}
                    name={id}
                    types={fileTypes}
                    disabled={disabled || loading}
                    required={required}
                    onTypeError={handleError}
                    onSizeError={handleErrorSize}
                    hoverTitle={placeholder}
                    maxSize={maxSize}
                    minSize={minSize}
                    classes={'w-100'}
                />
                <FormLabel id={id}
                    sx={{
                        color: error ? 'red' : 'inherit',
                    }}
                >
                    {helperText}
                </FormLabel>
            </div>
        </Tooltip>: null
    )
})