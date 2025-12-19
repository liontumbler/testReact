import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import Signature, { type SignatureRef } from '@uiw/react-signature';
import Button from "../libForm/Button";
import FormLabel from '@mui/material/FormLabel';

interface signatureProps {
    id: string
    label: string
    title: string
    disabled: boolean
    hidden?: boolean
    defaultValue?: string
    onChange?: Function
    required?: boolean
    loading?: boolean;
    size?: object
    color?: string
    onHandleSave: Function
}

export default forwardRef(({ onHandleSave, loading = false, required = false, defaultValue = '', id, label, disabled, hidden = false, onChange, title, color = '#000' }: signatureProps, ref) => {
    const $svg = useRef<SignatureRef>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const titleOriginal = title
    const [titleDinamic, setTitleDinamic] = useState<string>(title);
    const [points, setPoints] = useState<Record<string, number[][]> | undefined>(undefined)
    const [save, setSave] = useState<boolean>(false)
    const [disableSignature, setDisabledSignature] = useState<boolean>(false)
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');

    const validateField = () => {
        const val = validate(points)
        showMsgValid(val.valid, val.msg)
        return val
    }

    const getValue = () => {
        const image = true
        if(image) {
            const png = $svg.current?.svg;
        } else {
            return points;
        }
    }

    const clear = () => {
        $svg.current?.clear()
        setPoints(undefined)
    }

    const handleClear = () => {
        clear()
        const {valid, msg} = validate(undefined)
        showMsgValid(valid, msg)
    }

    const validate = (value: any) => {
        let valid = true;
        let msg = ''
        if (!value && required) {
            valid = false
            // msg = `${t('theField')} ${label} ${t('isRequired')}`
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
            setTitleDinamic(msg)
        } else {
            setError(false)
            setTitleDinamic(titleOriginal)
        }
    }

    const validateAndChage = (newValue: number[][]) => {
        setPoints((prev : any) => {
            let retunDta = null
            if(!prev && newValue) {
                retunDta = {'path-1': newValue}
            } else if(newValue) {
                retunDta = {
                    ...(prev),
                    ['path-'+ (prev ? Object.keys(prev).length +1 : 1)]: newValue,
                }
            }

            const {valid, msg} = validate(retunDta)
            showMsgValid(valid, msg)
            return retunDta
        });
    }

    const handlePoints = (data: number[][]) => {
        //validar si esta el boton si no esta guardar automaticamente
        if (data.length > 0) {
            validateAndChage(data)
            onChange ? onChange(points) : null
        };
    }

    const handleSave = () => {
        setSave(true)
        setDisabledSignature(true)
        onHandleSave ? onHandleSave(points) : null
    }

    useImperativeHandle(ref, () => ({
        validateField,
        getValue
    }));

    return (
        <div style={{position: 'relative'}}>
            <FormLabel
                sx={{
                    color: error ? 'red' : 'inherit',
                }}
            >
                {titleDinamic}{required ? '*' : null}
            </FormLabel>
            <Signature 
                ref={$svg} 
                readonly={disabled || disableSignature} 
                defaultPoints={points} 
                fill={color} 
                style={ { "--w-signature-background": "#e4e6ef" } as React.CSSProperties } 
                onPointer={handlePoints}
            />
            {points && !save ? 
                <Button
                    refInput={buttonRef}
                    type="button"
                    onClick={handleClear}
                    loading={loading}
                    disabled={disabled || disableSignature}
                    content={'Clear'}
                    color="error"
                    title='Limpia la firma'
                /> : null
            }
            {points ? 
                <Button
                    style={{ float: "right" }}
                    refInput={buttonRef}
                    type="button"
                    onClick={handleSave}
                    loading={loading}
                    disabled={disabled || disableSignature}
                    content={'Save'}
                    title='Guarda la firma'
                /> : null
            }
        </div>
    );
})

