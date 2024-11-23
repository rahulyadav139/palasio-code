import { Select, MenuItem } from '@mui/material';
import langOptions from '@/assets/languageOptions.json';
import { FC } from 'react';

interface ILanguageSelect {
  value: string;
  setValue: (value: string) => void;
}

export const LanguageSelect: FC<ILanguageSelect> = ({ value, setValue }) => {
  return (
    <Select
      value={value}
      onChange={e => setValue(e.target.value)}
      size="small"
      sx={{
        background: '#292C33',
        color: 'white',
        minWidth: 100,
        fontSize: '0.7rem',
        '& .MuiPaper-root': {
          minWidth: 100,
        },
        '& .MuiSelect-icon': {
          color: 'white',
        },
      }}
    >
      {langOptions.map(el => (
        <MenuItem
          sx={{
            fontSize: '0.8rem',
          }}
          key={el.value}
          value={el.value}
        >
          {el.label}
        </MenuItem>
      ))}
    </Select>
  );
};
