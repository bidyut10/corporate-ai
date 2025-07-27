import { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import PropTypes from 'prop-types';

const SkillsInput = ({ value = [], onChange, placeholder = "Add skills...", className = "" }) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleAddSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !value.includes(trimmedSkill)) {
      onChange([...value, trimmedSkill]);
      setInputValue('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    onChange(value.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      handleRemoveSkill(value[value.length - 1]);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Auto-add skill when comma is typed
    if (newValue.includes(',')) {
      const skills = newValue.split(',').map(s => s.trim()).filter(s => s);
      const newSkills = skills.filter(skill => !value.includes(skill));
      if (newSkills.length > 0) {
        onChange([...value, ...newSkills]);
        setInputValue('');
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const skills = pastedText.split(/[,\n]/).map(s => s.trim()).filter(s => s);
    const newSkills = skills.filter(skill => !value.includes(skill));
    if (newSkills.length > 0) {
      onChange([...value, ...newSkills]);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`min-h-[48px] px-4 py-2 border rounded-xl focus-within:ring-2 focus-within:ring-purple-400 focus-within:border-transparent transition-all ${
          isFocused ? 'border-purple-400' : 'border-neutral-200'
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {/* Skills Tags */}
          {value.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
            >
              {skill}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveSkill(skill);
                }}
                className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          
          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onPaste={handlePaste}
            placeholder={value.length === 0 ? placeholder : "Add more skills..."}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
          />
        </div>
      </div>
      
      {/* Helper Text */}
      <div className="mt-2 text-xs text-neutral-500">
        <p>Press Enter, comma, or paste to add skills. Use Backspace to remove the last skill.</p>
      </div>
      
      {/* Quick Add Buttons */}
      {value.length === 0 && (
        <div className="mt-3">
          <p className="text-xs text-neutral-600 mb-2">Popular skills:</p>
          <div className="flex flex-wrap gap-2">
            {['React', 'JavaScript', 'Python', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'Git'].map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleAddSkill(skill)}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full transition-colors"
              >
                <Plus className="w-3 h-3" />
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

SkillsInput.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default SkillsInput; 