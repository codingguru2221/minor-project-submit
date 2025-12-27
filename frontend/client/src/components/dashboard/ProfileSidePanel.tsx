import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiPut } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, User, Mail, Phone, X, Edit3, LogOut, Settings } from "lucide-react";
import { api } from "@shared/routes";
import { useLocation } from "wouter";

interface ProfileSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSidePanel({ isOpen, onClose }: ProfileSidePanelProps) {
  const { user, loading, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    city: user?.city || "",
    country: user?.country || "",
    profilePicture: user?.profilePicture || null as string | null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(user?.profilePicture || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    try {
      // Prepare the profile data to send to the backend
      const updatedProfile = {
        fullName: profileData.fullName,
        email: profileData.email,
        mobile: profileData.mobile,
        city: profileData.city,
        country: profileData.country,
        profilePicture: previewImage || profileData.profilePicture,
      };
      
      // Update the user profile on the backend
      const updatedUserResponse: any = await apiPut(`/api/users/${user?.id}`, updatedProfile);
      
      // Update the local user context with the new data
      if (updateUser && updatedUserResponse) {
        const mergedUser = {
          ...user,
          ...updatedUserResponse
        };
        updateUser(mergedUser);
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully."
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setProfileData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      city: user?.city || "",
      country: user?.country || "",
      profilePicture: user?.profilePicture || null,
    });
    setPreviewImage(null);
    setIsEditing(false);
  };

  const handleSignOut = () => {
    logout();
    setLocation('/login');
  };

  if (loading || !user || !isOpen) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div 
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-background shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Profile</h2>
            <ButtonCustom 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </ButtonCustom>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10 relative">
                    {(previewImage || user?.profilePicture) ? (
                      <img 
                        src={previewImage || user?.profilePicture || ""} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <User className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={triggerFileSelect}
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                {isEditing && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Click on the image to change
                  </p>
                )}
              </div>
              
              {/* Profile Information Section */}
              <div className="space-y-6">
                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile</Label>
                      <Input
                        id="mobile"
                        name="mobile"
                        value={profileData.mobile}
                        onChange={handleInputChange}
                        placeholder="Enter your mobile number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={`${profileData.city || ''}${profileData.city && profileData.country ? ', ' : ''}${profileData.country || ''}`}
                        onChange={(e) => {
                          const [city, country] = e.target.value.split(', ');
                          setProfileData(prev => ({
                            ...prev,
                            city: city || '',
                            country: country || ''
                          }));
                        }}
                        placeholder="City, Country"
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <ButtonCustom 
                        onClick={handleSave}
                        className="flex-1"
                      >
                        Save Changes
                      </ButtonCustom>
                      <ButtonCustom 
                        variant="outline" 
                        onClick={handleCancel}
                        className="flex-1"
                      >
                        Cancel
                      </ButtonCustom>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{profileData.fullName || "Not provided"}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <span>{profileData.email || "Not provided"}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <span>{profileData.mobile || "Not provided"}</span>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                      <p className="mt-1">
                        {profileData.city || profileData.country 
                          ? `${profileData.city}${profileData.city && profileData.country ? ', ' : ''}${profileData.country}` 
                          : "Not provided"}
                      </p>
                    </div>
                    
                    <ButtonCustom 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="gap-2 mt-4"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </ButtonCustom>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-border space-y-3">
            <ButtonCustom 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => setLocation('/profile')}
            >
              <Settings className="w-4 h-4" />
              View Full Profile
            </ButtonCustom>
            
            <ButtonCustom 
              variant="destructive" 
              className="w-full gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
}