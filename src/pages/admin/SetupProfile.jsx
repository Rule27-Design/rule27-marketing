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
  
  // Determine which step based on URL parameter
  const stepParam = searchParams.get('step');
  const isPasswordStep = stepParam === 'password';
  const isProfileStep = stepParam === 'profile';
  
  // Start at the appropriate step
  const [currentStep, setCurrentStep] = useState(isPasswordStep ? 0 : 1);
  
  const [formData, setFormData] = useState({
    // Step 0: Password Setup
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
        
        // Pre-fill form with existing profile data
        setFormData(prev => ({
          ...prev,
          full_name: profile.full_name || '',
          display_name: profile.display_name || '',
          job_title: profile.job_title || '',
          bio: profile.bio || '',
          avatar_url: profile.avatar_url || '',
          department: profile.department || [],
          expertise: profile.expertise || [],
          linkedin_url: profile.linkedin_url || '',
          twitter_url: profile.twitter_url || '',
          github_url: profile.github_url || '',
          is_public: profile.is_public || false,
          email_notifications: profile.email_notifications !== false,
          // Keep password fields empty
          password: '',
          confirmPassword: ''
        }));
        
        // Check if we should redirect
        const userData = session.user.user_metadata;
        const hasPassword = userData?.has_password === true;
        const profileCompleted = profile.onboarding_completed === true;
        
        // If everything is complete, redirect to admin
        if (hasPassword && profileCompleted && !isPasswordStep && !isProfileStep) {
          navigate('/admin');
          return;
        }
        
        // If password is set but we're on password step, skip to profile
        if (hasPassword && isPasswordStep) {
          navigate('/admin/setup-profile?step=profile');
          return;
        }
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

      // Update password
      const { data, error: passwordError } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (passwordError) {
        console.error('Password update error:', passwordError);
        throw new Error(passwordError.message || 'Failed to set password');
      }

      // Update user metadata to indicate password has been set
      await supabase.auth.updateUser({
        data: { 
          has_password: true,
          first_login: false,
          password_set_at: new Date().toISOString()
        }
      });

      // Clear password fields
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));

      // Move to profile setup
      setCurrentStep(1);
      navigate('/admin/setup-profile?step=profile', { replace: true });
      
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
    if (currentStep > 1) {
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
      const profileData = {
        full_name: formData.full_name,
        display_name: formData.display_name,
        job_title: formData.job_title,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
        department: formData.department.filter(Boolean),
        expertise: formData.expertise.filter(Boolean),
        linkedin_url: formData.linkedin_url,
        twitter_url: formData.twitter_url,
        github_url: formData.github_url,
        is_public: formData.is_public,
        email_notifications: formData.email_notifications,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      };

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
      await supabase.auth.updateUser({
        data: { 
          onboarding_completed: true,
          profile_completed_at: new Date().toISOString()
        }
      });

      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 500));

      // Navigate to dashboard
      window.location.href = '/admin';
      
    } catch (error) {
      console.error('Profile submit error:', error);
      setError(error.message || 'Failed to save profile. Please try again.');
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

  // Determine if we show password step
  const showPasswordStep = isPasswordStep || currentStep === 0;
  const totalSteps = showPasswordStep ? 4 : 3;
  const displayStep = showPasswordStep ? currentStep : currentStep - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-accent">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <span className="text-3xl font-bold text-accent">27</span>
          </div>
          <h1 className="text-3xl font-heading-bold text-white uppercase">
            {showPasswordStep && currentStep === 0 
              ? 'Secure Your Account' 
              : 'Complete Your Profile'}
          </h1>
          <p className="text-gray-400 mt-2">
            {showPasswordStep && currentStep === 0
              ? 'Set up your password to enable secure login'
              : "Let's finish setting up your profile"}
          </p>
          {existingProfile && (
            <p className="text-sm text-gray-500 mt-2">
              Welcome back, {existingProfile.email}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[...Array(totalSteps)].map((_, index) => {
              const stepNumber = showPasswordStep ? index : index + 1;
              return (
                <div key={index} className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold
                    ${displayStep >= index ? 'bg-accent text-white' : 'bg-gray-600 text-gray-400'}
                  `}>
                    {stepNumber === 0 ? <Icon name="Lock" size={20} /> : stepNumber}
                  </div>
                  {index < totalSteps - 1 && (
                    <div className={`w-20 h-1 ${displayStep > index ? 'bg-accent' : 'bg-gray-600'}`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-center space-x-4 mt-4 text-sm">
            {showPasswordStep && (
              <span className={displayStep >= 0 ? 'text-white' : 'text-gray-500'}>
                Password
              </span>
            )}
            <span className={displayStep >= (showPasswordStep ? 1 : 0) ? 'text-white' : 'text-gray-500'}>
              Basic Info
            </span>
            <span className={displayStep >= (showPasswordStep ? 2 : 1) ? 'text-white' : 'text-gray-500'}>
              Professional
            </span>
            <span className={displayStep >= (showPasswordStep ? 3 : 2) ? 'text-white' : 'text-gray-500'}>
              Preferences
            </span>
          </div>
        </div>

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

          {/* Step 0: Password Setup */}
          {currentStep === 0 && showPasswordStep && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading-bold uppercase mb-6">Set Your Password</h2>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-800">
                      Create a secure password for your account. You can also continue using magic links to sign in.
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
              
              {existingProfile && (
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-xs text-blue-800">
                    We've pre-filled some information from your profile. Update as needed.
                  </p>
                </div>
              )}
              
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
            {currentStep > (showPasswordStep ? 1 : 0) && (
              <Button
                variant="outline"
                onClick={handleBack}
                iconName="ArrowLeft"
              >
                Back
              </Button>
            )}
            
            <div className="ml-auto">
              {currentStep === 0 && showPasswordStep ? (
                <Button
                  variant="default"
                  onClick={handlePasswordSetup}
                  loading={saving}
                  disabled={saving || !formData.password || !formData.confirmPassword}
                  iconName="Lock"
                  className="bg-accent hover:bg-accent/90"
                >
                  Set Password & Continue
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