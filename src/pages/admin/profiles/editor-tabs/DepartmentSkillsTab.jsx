// src/pages/admin/profiles/editor-tabs/DepartmentSkillsTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

const DepartmentSkillsTab = ({ formData, errors, onChange, departments }) => {
  // Add department
  const addDepartment = () => {
    onChange('department', [...(formData.department || []), '']);
  };

  // Update department
  const updateDepartment = (index, value) => {
    const newDepartments = [...(formData.department || [])];
    newDepartments[index] = value;
    onChange('department', newDepartments);
  };

  // Remove department
  const removeDepartment = (index) => {
    const newDepartments = [...(formData.department || [])];
    newDepartments.splice(index, 1);
    onChange('department', newDepartments);
  };

  // Add expertise
  const addExpertise = () => {
    onChange('expertise', [...(formData.expertise || []), '']);
  };

  // Update expertise
  const updateExpertise = (index, value) => {
    const newExpertise = [...(formData.expertise || [])];
    newExpertise[index] = value;
    onChange('expertise', newExpertise);
  };

  // Remove expertise
  const removeExpertise = (index) => {
    const newExpertise = [...(formData.expertise || [])];
    newExpertise.splice(index, 1);
    onChange('expertise', newExpertise);
  };

  return (
    <div className="space-y-6">
      {/* Departments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Departments
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={addDepartment}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add Department
          </Button>
        </div>

        {(formData.department || []).length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Icon name="Briefcase" size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-3">No departments assigned</p>
            <Button
              variant="primary"
              size="sm"
              onClick={addDepartment}
            >
              Add Department
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {formData.department.map((dept, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select
                  value={dept}
                  onChange={(value) => updateDepartment(index, value)}
                  options={[
                    { value: '', label: 'Select department...' },
                    ...departments.map(d => ({ 
                      value: d.name, 
                      label: d.name 
                    }))
                  ]}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDepartment(index)}
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expertise */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Skills & Expertise
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={addExpertise}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add Skill
          </Button>
        </div>

        {(formData.expertise || []).length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Icon name="Award" size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-3">No skills added</p>
            <Button
              variant="primary"
              size="sm"
              onClick={addExpertise}
            >
              Add First Skill
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {formData.expertise.map((skill, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={skill}
                  onChange={(e) => updateExpertise(index, e.target.value)}
                  placeholder="e.g., UI/UX Design, React, Marketing"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExpertise(index)}
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Skill suggestions */}
        {formData.expertise?.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Common skills:</p>
            <div className="flex flex-wrap gap-2">
              {['JavaScript', 'React', 'Design', 'Marketing', 'Project Management', 'SEO'].map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    if (!formData.expertise.includes(skill)) {
                      onChange('expertise', [...formData.expertise, skill]);
                    }
                  }}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full"
                  disabled={formData.expertise.includes(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentSkillsTab;