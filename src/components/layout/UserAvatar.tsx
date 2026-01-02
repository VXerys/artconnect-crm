import { useState } from 'react';
import { LogOut, Settings, User as UserIcon, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get user initials from name or email
 */
const getInitials = (name?: string | null, email?: string | null): string => {
  if (name) {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  
  return 'U';
};

/**
 * Get avatar URL from user metadata
 * Handles both Google OAuth and custom uploaded avatars
 */
const getAvatarUrl = (user: any): string | null => {
  if (!user) return null;
  
  // Try user metadata first (from OAuth providers like Google)
  const metadata = user.user_metadata || {};
  
  // Google OAuth provides avatar_url or picture
  if (metadata.avatar_url) return metadata.avatar_url;
  if (metadata.picture) return metadata.picture;
  
  // Check identities for provider-specific avatar
  if (user.identities && user.identities.length > 0) {
    for (const identity of user.identities) {
      if (identity.identity_data?.avatar_url) {
        return identity.identity_data.avatar_url;
      }
      if (identity.identity_data?.picture) {
        return identity.identity_data.picture;
      }
    }
  }
  
  return null;
};

/**
 * Get display name from user
 */
const getDisplayName = (user: any): string => {
  if (!user) return 'User';
  
  const metadata = user.user_metadata || {};
  
  // Try different sources for name
  if (metadata.full_name) return metadata.full_name;
  if (metadata.name) return metadata.name;
  
  // Fallback to email username
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return 'User';
};

// ============================================================================
// USER AVATAR COMPONENT
// ============================================================================

interface UserAvatarProps {
  showDropdown?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar = ({ showDropdown = true, size = 'md', className }: UserAvatarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const avatarUrl = getAvatarUrl(user);
  const displayName = getDisplayName(user);
  const initials = getInitials(user?.user_metadata?.full_name || user?.user_metadata?.name, user?.email);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login');
    setIsOpen(false);
  };

  const AvatarComponent = (
    <Avatar className={cn(
      sizeClasses[size],
      'border-2 border-primary/30 cursor-pointer hover:border-primary/50 transition-colors',
      className
    )}>
      <AvatarImage 
        src={avatarUrl || undefined} 
        alt={displayName} 
        className="object-cover"
      />
      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  if (!showDropdown) {
    return AvatarComponent;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 outline-none">
          {AvatarComponent}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-card border-border"
        sideOffset={8}
      >
        {/* User Info */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border border-primary/30">
              <AvatarImage src={avatarUrl || undefined} alt={displayName} />
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-semibold text-foreground leading-tight">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                {user?.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => {
            navigate('/settings');
            setIsOpen(false);
          }}
        >
          <Settings className="w-4 h-4 mr-2" />
          Pengaturan
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
