import type { Option } from '~/interfaces/Option';
export interface SelectProps {
    id: string
    label: string
    title: string
    disabled: boolean
    error?: boolean
    defaultValue?: string
    onChange?: Function
    required?: boolean
    options: Array<Option>
    loading?: boolean;
}