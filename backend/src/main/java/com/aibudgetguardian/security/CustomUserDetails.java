package com.aibudgetguardian.security;

import com.aibudgetguardian.entity.Permission;
import com.aibudgetguardian.entity.Role;
import com.aibudgetguardian.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final UUID id;
    private final String email;
    private final String password;
    private final String fullName;
    private final UUID departmentId;
    private final String status;
    private final Collection<? extends GrantedAuthority> authorities;

    public static CustomUserDetails build(User user) {
        Set<GrantedAuthority> authorities = new HashSet<>();

        // Add Role Granted Authorities (ROLE_SUPER_ADMIN, ROLE_FINANCE_OFFICER, etc.)
        for (Role role : user.getRoles()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getCode()));
            // Add Permission Granted Authorities (budget:view, invoice:create, etc.)
            if (role.getPermissions() != null) {
                for (Permission permission : role.getPermissions()) {
                    authorities.add(new SimpleGrantedAuthority(permission.getCode()));
                }
            }
        }

        UUID deptId = user.getDepartment() != null ? user.getDepartment().getId() : null;

        return new CustomUserDetails(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getFullName(),
                deptId,
                user.getStatus(),
                authorities
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !"LOCKED".equalsIgnoreCase(status);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return "ACTIVE".equalsIgnoreCase(status);
    }
}
