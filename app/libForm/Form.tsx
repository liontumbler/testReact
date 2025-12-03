import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';

import Input, { type modelInput, type inputProps} from "../libForm/Input";
import Button from "../libForm/Button";

import Grid from '@mui/material/Grid';

interface modelForm {
    validateFields: Function
    getValues: Function
}

interface input {
    fields: Array<inputProps>
    service?: Function
    children?: React.ReactNode
}

export default forwardRef(({ fields, service, children }: input, ref) => {

    const [disabled, setDisabled] = useState<boolean>(false);
    const [cargando, setCargando] = useState<boolean>(false);
    
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const refCampos = useRef<React.RefObject<modelInput | null>[]>([]);
    fields.forEach((field: inputProps, key: number) => {
        refCampos.current[key] = React.createRef<modelInput>();
    });

    // useEffect(() => {
    //     console.log(refCampos.current[0].current?.getValue(), 'ddd', refCampos.current[0].current?.validateField());
    // }, []);

    const getValues = () => {
        const values = fields.map((field: inputProps, key: number) => {
            return {[field.id]: refCampos.current[key].current?.getValue()}
        })
        return values;
    }

    const validateFields = () => {
        let response: {
            valid: boolean;
            fields: any[];
        } = {
            valid: true,
            fields: []
        }

        fields.forEach((field: any, key: number) => {
            const {valid, msg} = refCampos.current[key].current?.validateField()
            if(!valid) {
                response.valid = false
                response.fields.push(msg)
            }
        });

        return response
    }

    const handleForm = async (event: React.FormEvent) => {
        event.preventDefault();
        const {valid, fields} = validateFields()
        if(valid) {
            if(service) {
                setCargando(true)
                setDisabled(true)
                await service(getValues())
                setCargando(false)
                setDisabled(false)
            }
        } 
    }

    useImperativeHandle(ref, () => ({
        validateFields,
        getValues
    }));

    return (
        <form>
        {/* <form onSubmit={handleForm}> */}
            <Grid container spacing={2} >
                {fields.map((field: any, key: number) => (
                    <Grid size={{ xs: 12, sm: 12, md: 6 }} key={key}>
                        <Input
                            loading={cargando}
                            id={field.id}
                            label={field.label}
                            type={field.type}
                            title={field.title}
                            placeholder={field.placeholder}
                            minLength={field.minLength}
                            maxLength={field.maxLength}
                            defaultValue={field.defaultValue}
                            ref={refCampos.current[key]}
                            disabled={field.disabled || disabled}
                            required={field.required}
                        />
                    </Grid>
                ))}
                
                <Grid size={{ xs: 12, sm: 12, md: 12 }} justifySelf="center">
                    {
                        service ? <Button
                            refInput={buttonRef}
                            type="submit"
                            onClick={handleForm}
                            loading={cargando}
                            disabled={disabled}
                            content={'title'}
                        /> : null
                    }
                    
                    {children}
                </Grid>
            </Grid>
        </form>
    )
})

export type {modelForm};