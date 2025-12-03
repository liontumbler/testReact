import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

interface input {
    
}

interface modelInput {
    validarCampo: Function
    value: Function
    getId: Function
    setValue: Function
}

export default forwardRef(({ content, disabled, href, onClick, title, loading, icon, type, refInput }: any, ref) => {
    return (
        <Tooltip title={title} arrow>
            <Button 
                ref={refInput}
                variant="contained"
                color="success"
                loadingPosition="end"
                endIcon={icon}
                disabled={disabled}
                href={href}
                onClick={onClick}
                loading={loading}
                type={type}
                size="large"
            >
                {content}
            </Button>
        </Tooltip>
        
    )
})

export type {modelInput};

