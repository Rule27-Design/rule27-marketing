// src/pages/admin/settings/components/AwardManager.jsx
import React, { useState } from 'react';
import Icon from '../../../../components/AdminIcon';
import Button from '../../../../components/ui/Button';
import { settingsOperations } from '../services/SettingsOperations';
import AwardEditor from '../editors/AwardEditor';
import { useToast } from '../../../../components/ui/Toast';

const AwardManager = ({ awards, userProfile, onUpdate }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  const toast = useToast();

  const handleEdit = (award) => {
    setEditingAward(award);
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditingAward(null);
    setShowEditor(true);
  };

  const handleSave = async (data) => {
    try {
      if (editingAward) {
        await settingsOperations.updateAward(editingAward.id, data);
        toast.success('Award updated successfully');
      } else {
        await settingsOperations.createAward(data);
        toast.success('Award created successfully');
      }
      setShowEditor(false);
      onUpdate();
    } catch (error) {
      toast.error('Failed to save award', error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this award?')) return;
    
    try {
      await settingsOperations.deleteAward(id);
      toast.success('Award deleted successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete award', error.message);
    }
  };

  // Group awards by year
  const awardsByYear = awards.reduce((acc, award) => {
    const year = award.year || 'Unknown';
    if (!acc[year]) acc[year] = [];
    acc[year].push(award);
    return acc;
  }, {});

  const sortedYears = Object.keys(awardsByYear).sort((a, b) => b - a);

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="font-heading-bold text-lg uppercase">Awards & Recognition</h2>
            <p className="text-sm text-gray-600 mt-1">Showcase your achievements and certifications</p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleCreate}
            iconName="Plus"
            className="bg-accent hover:bg-accent/90"
          >
            Add Award
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {sortedYears.map(year => (
            <div key={year}>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Icon name="Calendar" size={18} className="mr-2" />
                {year}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {awardsByYear[year].map((award) => (
                  <div 
                    key={award.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        {award.icon && (
                          <div className={`p-2 rounded-lg ${award.color || 'bg-gray-100'}`}>
                            <Icon name={award.icon} size={20} />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium">{award.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{award.organization}</p>
                          {award.category && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 rounded">
                              {award.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {award.description && (
                      <p className="text-sm text-gray-600 mb-3">{award.description}</p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        award.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {award.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex space-x-2">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => handleEdit(award)}
                        >
                          <Icon name="Edit" size={14} />
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => handleDelete(award.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showEditor && (
        <AwardEditor
          award={editingAward}
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default AwardManager;