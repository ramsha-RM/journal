import React, { useState, useRef } from "react";
import "../style/AuthStyle/verification.css";

const OtpInput = ({ length = 6, onChange }) => {
  const [values, setValues] = useState(Array(length).fill(""));
  const [activeInput, setActiveInput] = useState(0);
  const inputs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    onChange && onChange(newValues.join(""));

    if (value && index < length - 1) {
      setActiveInput(index + 1);
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const newValues = [...values];

      if (values[index]) {
        newValues[index] = "";
        setValues(newValues);
        onChange && onChange(newValues.join(""));
      } else if (index > 0) {
        setActiveInput(index - 1);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pasteData) return;

    const newValues = pasteData.split("");
    const filled = [...newValues, ...Array(length - newValues.length).fill("")];

    setValues(filled);
    onChange && onChange(filled.join(""));

    const nextIndex = pasteData.length - 1;
    setActiveInput(nextIndex);
    inputs.current[nextIndex]?.focus();
  };

  const handleFocus = (index) => {
    setActiveInput(index);
  };

  return (
    <div className="otp">
      {values.map((value, index) => (
        <input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          type="text"
          maxLength={1}
          inputMode="numeric"
          value={value ? "•" : ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
        />
      ))}
    </div>
  );
};

export default OtpInput;