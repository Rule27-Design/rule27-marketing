// src/pages/admin/SetupProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import { Checkbox } from '../../components/ui/Checkbox';

const SetupProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [session, setSession] = useState(null);
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    full_name: '',
    display_name: '',
    job_title: '',
    bio: '',
    avatar_url: '',
    
    // Step 2: Professional Info
    department: [],
    expertise: [],
    linkedin_url: '',
    twitter_url: '',
    github_url: '',
    
    // Step 3: Account Setup
    password: '',
    confirmPassword: '',
    is_public: false,
    email_notifications: true,
    
    // Hidden fields
    onboarding_completed: false
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/admin/login');
      return;
    }

    setSession(session);

    // Load existing profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', session.user.id)
      .single();

    if (profile) {
      if (profile.onboarding_completed) {
        navigate('/admin');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        ...profile,
        password: '',
        confirmPassword: ''
      }));
    }

    setLoading(false);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    try {
      // Update password if provided
      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.password
        });

        if (passwordError) throw passwordError;
      }

      // Update profile
      const profileData = { ...formData };
      delete profileData.password;
      delete profileData.confirmPassword;
      
      profileData.onboarding_completed = true;
      profileData.updated_at = new Date().toISOString();

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('auth_user_id', session.user.id);

      if (profileError) throw profileError;

      // Navigate to dashboard
      navigate('/admin');
    } catch (error) {
      setError(error.message);
      setSaving(false);
    }
  };

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const updateArrayItem = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-accent">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <span className="text-3xl font-bold text-accent">27</span>
          </div>
          <h1 className="text-3xl font-heading-bold text-white uppercase">Welcome to Rule27</h1>
          <p className="text-gray-400 mt-2">Let's set up your profile</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold
                  ${currentStep >= step ? 'bg-accent text-white' : 'bg-gray-600 text-gray-400'}
                `}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-20 h-1 ${currentStep > step ? 'bg-accent' : 'bg-gray-600'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-8 mt-4">
            <span className={`text-sm ${currentStep >= 1 ? 'text-white' : 'text-gray-500'}`}>
              Basic Info
            </span>
            <span className={`text-sm ${currentStep >= 2 ? 'text-white' : 'text-gray-500'}`}>
              Professional
            </span>
            <span className={`text-sm ${currentStep >= 3 ? 'text-white' : 'text-gray-500'}`}>
              Account
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {error && (
            <div className="mb-6 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading-bold uppercase mb-6">Basic Information</h2>
              
              <Input
                label="Full Name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                placeholder="John Doe"
              />

              <Input
                label="Display Name (optional)"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="How you'd like to be called"
              />

              <Input
                label="Job Title"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                placeholder="Senior Developer"
              />

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full h-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <Input
                label="Avatar URL (optional)"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          )}

          {/* Step 2: Professional Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading-bold uppercase mb-6">Professional Information</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Departments</label>
                {formData.department.map((dept, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={dept}
                      onChange={(e) => updateArrayItem('department', index, e.target.value)}
                      placeholder="e.g., Development, Marketing"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem('department', index)}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('department')}
                  iconName="Plus"
                >
                  Add Department
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Areas of Expertise</label>
                {formData.expertise.map((skill, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={skill}
                      onChange={(e) => updateArrayItem('expertise', index, e.target.value)}
                      placeholder="e.g., React, UI/UX Design"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem('expertise', index)}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('expertise')}
                  iconName="Plus"
                >
                  Add Expertise
                </Button>
              </div>

              <Input
                label="LinkedIn URL (optional)"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/username"
              />

              <Input
                label="Twitter/X URL (optional)"
                value={formData.twitter_url}
                onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                placeholder="https://twitter.com/username"
              />

              <Input
                label="GitHub URL (optional)"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="https://github.com/username"
              />
            </div>
          )}

          {/* Step 3: Account Setup */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading-bold uppercase mb-6">Account Setup</h2>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Optional:</strong> Set a password to enable password login. 
                  You can always use magic links to sign in.
                </p>
              </div>

              <Input
                type="password"
                label="Password (optional)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
              />

              <Input
                type="password"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
                disabled={!formData.password}
              />

              <div className="space-y-4 pt-4">
                <Checkbox
                  checked={formData.is_public}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                  label="Make my profile public"
                  description="Show your profile on the team page"
                />

                <Checkbox
                  checked={formData.email_notifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, email_notifications: checked })}
                  label="Email notifications"
                  description="Receive email updates about important activities"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                iconName="ArrowLeft"
              >
                Back
              </Button>
            )}
            
            <div className="ml-auto">
              {currentStep < 3 ? (
                <Button
                  variant="default"
                  onClick={handleNext}
                  iconName="ArrowRight"
                  iconPosition="right"
                  className="bg-accent hover:bg-accent/90"
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  loading={saving}
                  disabled={saving}
                  iconName="Check"
                  className="bg-accent hover:bg-accent/90"
                >
                  Complete Setup
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupProfile;