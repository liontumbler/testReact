import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';

import Input, { type modelInput, type inputProps } from "../libForm/Input";
import Select /*{ type modelSelect, type option }*/ from "../libForm/Select";
import RadioGroup /*{ type modelSelect, type option }*/ from "../libForm/RadioGroup";
import Signature /*{ type modelSelect, type option }*/ from "../libForm/Signature";
import File /*{ type modelSelect, type option }*/ from "../libForm/File";
import EnhancedTable /*{ type modelSelect, type option }*/ from "../libForm/Table";

import Button from "../libForm/Button";
import CheckboxGroup /*{ type modelCheckbox, type checkboxProps }*/ from "../libForm/CheckboxGroup";

import Grid from '@mui/material/Grid';

interface modelForm {
    validateFields: Function
    getValues: Function
}

interface formProps {
    fields: Array<any>//mirar
    service?: Function
    children?: React.ReactNode
}

export default forwardRef(({ fields, service, children }: formProps, ref) => {

    const [disabled, setDisabled] = useState<boolean>(false);
    const [cargando, setCargando] = useState<boolean>(false);

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const refCampos = useRef<React.RefObject<modelInput | null>[]>([]);

    fields.forEach((field: inputProps, key: number) => {
        refCampos.current[key] = React.createRef<modelInput>();
    });

    const getValues = () => {        
        const values = fields.map((field: inputProps, key: number) => {
            if (!field.hidden) {
                if (field.type === 'checkbox') {
                    if (field.checkboxes) {
                        return refCampos.current[key].current?.getValue()
                    } else {
                        console.error('carece de propiedad checkbox');
                    }
                } else {
                    return { [field.id]: refCampos.current[key].current?.getValue() }
                }
            }
        })
        return values.filter((field) => (field));
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
            if (!field.hidden) {
                if (field.type === 'checkbox') {
                    field.checkboxes.forEach((checkbox: any) => {
                        const { valid, msg } = refCampos.current[key].current?.validateField()
                        if (!valid) {
                            response.valid = false
                            response.fields.push(msg)
                        }
                    });
                } else {// field.type === 'select'
                    const { valid, msg } = refCampos.current[key].current?.validateField()
                    if (!valid) {
                        response.valid = false
                        response.fields.push(msg)
                    }
                }
            }
        });

        return response
    }

    const handleForm = async (event: React.FormEvent) => {
        event.preventDefault();
        const { valid, fields } = validateFields()
        if (valid) {
            if (service) {
                setCargando(true)
                setDisabled(true)
                await service(getValues())
                setCargando(false)
                setDisabled(false)
            }
        }
    }

    const HandleSaveSignature = (data: any) => {
        console.log('save', data);
    }

    useImperativeHandle(ref, () => ({
        validateFields,
        getValues
    }));

    return (
        <form>
            {/* <form onSubmit={handleForm}> */}
            <Grid container spacing={2} >
                {fields.map((field: inputProps, key: number) => (
                    field.type == 'file' ? 
                        (!field.hidden) ? <Grid size={field.size ? field.size : { xs: 12, sm: 12, md: 6 }} key={key}>
                            <File
                                id={field.id}
                                label={field.label}
                                ref={refCampos.current[key]}
                                loading={cargando}
                                title={field.title}
                                defaultValue={field.defaultValue}
                                required={field.required}
                                disabled={field.disabled || disabled}
                                fileTypes={field.fileTypes ?? ["JPEG", "PNG", "GIF"]}
                            />
                        </Grid> : null
                    :
                    field.type == 'signature' ? 
                        (!field.hidden) ? <Grid size={field.size ? field.size : { xs: 12, sm: 12, md: 6 }} key={key}>
                            <Signature
                                id={field.id}
                                label={field.label}
                                ref={refCampos.current[key]}
                                loading={cargando}
                                title={field.title}
                                defaultValue={field.defaultValue}
                                required={field.required}
                                disabled={field.disabled || disabled}
                                onHandleSave={HandleSaveSignature}
                            />
                        </Grid> : null
                    :
                    field.type == 'radio' ? 
                        (!field.hidden) ? <Grid size={field.size ? field.size : { xs: 12, sm: 12, md: 6 }} key={key}>
                            <RadioGroup
                                row={field.row}
                                ref={refCampos.current[key]}
                                loading={cargando}
                                description={field.title}
                                defaultValue={field.defaultValue}
                                required={field.required}
                                radios={field.radios ? field.radios : []}
                            />
                        </Grid> : null
                    :
                    field.type == 'select' ? 
                        (!field.hidden) ? <Grid size={field.size ? field.size : { xs: 12, sm: 12, md: 6 }} key={key}>
                            <Select
                                ref={refCampos.current[key]}
                                loading={cargando}
                                id={field.id}
                                label={field.label}
                                title={field.title}
                                defaultValue={field.defaultValue}
                                disabled={field.disabled || disabled}
                                required={field.required}
                                options={field.options ? field.options : []}
                            />
                        </Grid> : null
                    :
                    field.type == 'checkbox' ? 
                        (!field.hidden) ? <Grid size={field.size ? field.size : { xs: 12, sm: 12, md: 6 }} key={key}>
                            <CheckboxGroup
                                ref={refCampos.current[key]}
                                loading={cargando}
                                checkboxes={field.checkboxes ? field.checkboxes : []}
                            />
                        </Grid> : null
                    :
                    (!field.hidden) ? <Grid size={field.size ? field.size : { xs: 12, sm: 12, md: 6 }} key={key}>
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
                    </Grid> : null
                ))}

                {
                    children || service ? <Grid size={{ xs: 12, sm: 12, md: 12 }} justifySelf="center">
                        {
                            service ? <Button
                                refInput={buttonRef}
                                type="submit"
                                onClick={handleForm}
                                loading={cargando}
                                disabled={disabled}
                                content={'title'}
                                title={'enviar'}
                            /> : null
                        }

                        {children}
                    </Grid> : null
                }
            </Grid>
            <EnhancedTable/>
        </form>
    )
})

export type { modelForm, formProps };