import React from 'react'
import Select from 'react-select';

export type DropDownProps = {
    placeholder?: string;
    listItems: {
        value: any;
        label: string;
    }[],
    value: any;
    multiple?: boolean;
    onChange?: (val: any) => void;
    closeOnSelect?: boolean;
}

const DropDown: React.FC<DropDownProps> = ({ placeholder, listItems, value, multiple, onChange, closeOnSelect }) => {
  return (
    <div className='w-full'>
        <Select
            placeholder={placeholder ?? 'select...'}
            options={listItems}
            value={value}
            isMulti={multiple}
            onChange={onChange}
            closeMenuOnSelect={closeOnSelect}
        />
    </div>
  )
}

export default DropDown