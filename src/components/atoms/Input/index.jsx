import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Root = styled.input`
  width: 100%;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 4px;
  border: 2px solid #ddd;
  box-sizing: border-box;
  :focus {
    border-color: rgba(100, 100, 255, 0.5);
  }
  ::placeholder {
    color: #ddd;
  }
`;

export const InputPresenter = ({
  className,
  onChange,
  defaultValue,
  placeholder,
}) => (
  <Root
    className={className}
    defaultValue={defaultValue}
    onChange={onChange}
    placeholder={placeholder}
  />
);

InputPresenter.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
};

InputPresenter.defaultProps = {
  className: "",
  onChange: null,
  defaultValue: "",
  placeholder: "",
};

export const InputContainer = ({
  className,
  onChange,
  defaultValue,
  placeholder,
  presenter,
}) => {
  const [value, setValue] = useState(defaultValue);
  return presenter({
    className,
    onChange: (e) => {
      const { value: newValue } = e.target;
      if (newValue === value) {
        return;
      }
      setValue(newValue);
      onChange(newValue);
    },
    defaultValue,
    placeholder,
  });
};

InputContainer.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  presenter: PropTypes.func.isRequired,
};

InputContainer.defaultProps = {
  className: "",
  onChange: null,
  defaultValue: "",
  placeholder: "",
};

export default (props) => (
  <InputContainer presenter={InputPresenter} {...props} />
);
