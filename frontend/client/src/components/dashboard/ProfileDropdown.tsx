import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ButtonCustom } from "@/components/ui/button-custom";
import { User } from "lucide-react";
import { ProfileSidePanel } from "./ProfileSidePanel";

interface ProfileDropdownProps {
  children: React.ReactNode;
}

export function ProfileDropdown({ children }: ProfileDropdownProps) {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const handleOpenSidePanel = () => {
    setIsSidePanelOpen(true);
  };

  if (loading || !user) {
    return <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-bold">{children}</div>;
  }

  return (
    <>
      <button 
        onClick={handleOpenSidePanel}
        className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-bold cursor-pointer"
      >
        {user?.fullName?.[0] || "U"}
      </button>
      
      <ProfileSidePanel 
        isOpen={isSidePanelOpen} 
        onClose={() => setIsSidePanelOpen(false)} 
      />
    </>
  );
}
