// src/pages/admin/SetupProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import { Checkbox } from '../../components/ui/Checkbox';

const SetupProfile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [existingProfile, setExistingProfile] = useState(null);
  
  // Check if we're in password-only mode (for invited users)
  const passwordOnlyMode = searchParams.get('step') === 'password';
  const [currentStep, setCurrentStep] = useState(passwordOnlyMode ? 0 : 1);
  
  const [formData, setFormData] = useState({
    // Step 0: Password Setup (for invited users)
    password: '',
    confirmPassword: '',
    
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
    is_public: false,
    email_notifications: true,
    
    // Hidden fields
    onboarding_completed: false
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session found, redirecting to login');
        navigate('/admin/login');
        return;
      }

      setSession(session);

      // Load existing profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      }

      if (profile) {
        setExistingProfile(profile);
        
        // If profile is complete and we're not in password setup mode, redirect
        if (profile.onboarding_completed && !passwordOnlyMode) {
          navigate('/admin');
          return;
        }
        
        // Populate form with existing data
        setFormData(prev => ({
          ...prev,
          ...profile,
          password: '',
          confirmPassword: ''
        }));
      }

      setLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      setError('Authentication error. Please try logging in again.');
      setLoading(false);
    }
  };

  const handlePasswordSetup = async () => {
    setSaving(true);
    setError(null);

    try {
      // Validate passwords
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Session expired. Please request a new login link.');
      }

      // Update password
      const { data, error: passwordError } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (passwordError) {
        console.error('Password update error:', passwordError);
        throw new Error(passwordError.message || 'Failed to set password');
      }

      // Update user metadata to indicate password has been set
      const { error: metaError } = await supabase.auth.updateUser({
        data: { 
          has_password: true,
          first_login: false,
          password_set_at: new Date().toISOString()
        }
      });

      if (metaError) {
        console.error('Metadata update error:', metaError);
        // Don't throw here, password was set successfully
      }

      // Update profile if it exists
      if (existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProfile.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
        }
      }

      // Show success message
      setError(null);
      
      // Decide where to go next
      if (existingProfile?.onboarding_completed) {
        // Profile is complete, go to admin
        navigate('/admin');
      } else {
        // Continue with profile setup
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Password setup error:', error);
      setError(error.message || 'Failed to set password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > (passwordOnlyMode ? 0 : 1)) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    try {
      if (!session) {
        throw new Error('Session expired. Please log in again.');
      }

      // Prepare profile data
      const profileData = { ...formData };
      delete profileData.password;
      delete profileData.confirmPassword;
      
      profileData.onboarding_completed = true;
      profileData.updated_at = new Date().toISOString();

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('auth_user_id', session.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw new Error('Failed to update profile. Please try again.');
      }

      // Update user metadata
      const { error: metaError } = await supabase.auth.updateUser({
        data: { 
          onboarding_completed: true,
          first_login: false
        }
      });

      if (metaError) {
        console.error('User metadata update error:', metaError);
      }

      // Navigate to dashboard
      navigate('/admin');
    } catch (error) {
      console.error('Profile submit error:', error);
      setError(error.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), '']
    });
  };

  const updateArrayItem = (field, index, value) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const removeArrayItem = (field, index) => {
    const newArray = (formData[field] || []).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Calculate total steps based on mode
  const totalSteps = passwordOnlyMode && existingProfile?.onboarding_completed ? 1 : 4;
  const stepOffset = passwordOnlyMode ? 0 : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-accent">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <span className="text-3xl font-bold text-accent">27</span>
          </div>
          <h1 className="text-3xl font-heading-bold text-white uppercase">
            {passwordOnlyMode && existingProfile?.onboarding_completed 
              ? 'Secure Your Account' 
              : 'Welcome to Rule27'}
          </h1>
          <p className="text-gray-400 mt-2">
            {passwordOnlyMode && existingProfile?.onboarding_completed
              ? 'Set up your password to enable secure login'
              : "Let's set up your profile"}
          </p>
        </div>

        {/* Progress Bar - Only show if not in password-only mode for existing users */}
        {!(passwordOnlyMode && existingProfile?.onboarding_completed) && (
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[...Array(totalSteps)].map((_, index) => {
                const stepNumber = index + stepOffset;
                return (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold
                      ${currentStep >= stepNumber ? 'bg-accent text-white' : 'bg-gray-600 text-gray-400'}
                    `}>
                      {stepNumber === 0 ? <Icon name="Lock" size={20} /> : stepNumber}
                    </div>
                    {index < totalSteps - 1 && (
                      <div className={`w-20 h-1 ${currentStep > stepNumber ? 'bg-accent' : 'bg-gray-600'}`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {passwordOnlyMode && (
                <span className={`text-sm ${currentStep >= 0 ? 'text-white' : 'text-gray-500'}`}>
                  Password
                </span>
              )}
              {!(passwordOnlyMode && existingProfile?.onboarding_completed) && (
                <>
                  <span className={`text-sm ${currentStep >= 1 ? 'text-white' : 'text-gray-500'}`}>
                    Basic Info
                  </span>
                  <span className={`text-sm ${currentStep >= 2 ? 'text-white' : 'text-gray-500'}`}>
                    Professional
                  </span>
                  <span className={`text-sm ${currentStep >= 3 ? 'text-white' : 'text-gray-500'}`}>
                    Preferences
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {error && (
            <div className="mb-6 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
              <div className="flex items-start space-x-2">
                <Icon name="AlertCircle" size={16} className="mt-0.5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Step 0: Password Setup (for invited users) */}
          {currentStep === 0 && passwordOnlyMode && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading-bold uppercase mb-6">Set Your Password</h2>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-800">
                      You've been invited to Rule27 Design Admin. Set up a password to secure your account.
                      You can also continue to use magic links to sign in if you prefer.
                    </p>
                  </div>
                </div>
              </div>
              
              <Input
                type="password"
                label="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="At least 6 characters"
              />

              <Input
                type="password"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                placeholder="Re-enter your password"
              />

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Password Requirements:</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center space-x-2">
                    <Icon 
                      name={formData.password.length >= 6 ? "CheckCircle" : "Circle"} 
                      size={14} 
                      className={formData.password.length >= 6 ? "text-green-500" : "text-gray-400"}
                    />
                    <span>At least 6 characters</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon 
                      name={formData.password && formData.password === formData.confirmPassword ? "CheckCircle" : "Circle"} 
                      size={14} 
                      className={formData.password && formData.password === formData.confirmPassword ? "text-green-500" : "text-gray-400"}
                    />
                    <span>Passwords match</span>
                  </li>
                </ul>
              </div>
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
                {(formData.department || []).map((dept, index) => (
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
                {(formData.expertise || []).map((skill, index) => (
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

          {/* Step 3: Preferences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading-bold uppercase mb-6">Account Preferences</h2>
              
              <div className="space-y-4">
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

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={20} className="text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-green-800 font-medium">Almost done!</p>
                    <p className="text-xs text-green-700 mt-1">
                      Click "Complete Setup" to finish setting up your profile and access the admin panel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > (passwordOnlyMode ? 0 : 1) && (
              <Button
                variant="outline"
                onClick={handleBack}
                iconName="ArrowLeft"
              >
                Back
              </Button>
            )}
            
            <div className="ml-auto">
              {currentStep === 0 && passwordOnlyMode ? (
                <Button
                  variant="default"
                  onClick={handlePasswordSetup}
                  loading={saving}
                  disabled={saving || !formData.password || !formData.confirmPassword}
                  iconName="Lock"
                  className="bg-accent hover:bg-accent/90"
                >
                  {existingProfile?.onboarding_completed ? 'Set Password & Continue' : 'Set Password'}
                </Button>
              ) : currentStep < 3 ? (
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