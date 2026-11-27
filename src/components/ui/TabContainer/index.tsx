import React from 'react'

interface TabContainerProps {
  children: React.ReactNode;
  value: number;
  index: number;
  key: string;
}

const TabContainer = ({ children, value, index, ...other }: TabContainerProps) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
};

export default TabContainer;