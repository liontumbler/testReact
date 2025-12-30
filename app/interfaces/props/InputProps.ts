import type { CheckboxProps } from '~/interfaces/props/CheckboxProps';
import type { Option } from '~/interfaces/Option';

export interface InputProps {
    id: string
    label: string
    type: string
    title: string
    disabled: boolean
    hidden?: boolean
    minLength?: number
    maxLength?: number
    placeholder?: string
    inputRef?: any
    defaultValue?: any
    onChange?: Function
    required?: boolean
    min?: string
    max?: string
    loading?: boolean;
    size?: object
    checkboxes?: Array<CheckboxProps>
    options?: Array<Option>
    radios?: Array<any>
    row?: boolean
    value?: any
    fileTypes?: Array<'JPEG' | 'PNG' | 'GIF'>
}