package org.hotelms.security;

import org.hotelms.entity.User;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpSession;

/**
 * Simple Session Manager for beginners
 * This class helps manage user sessions in a simple way
 */
@Component
public class SessionManager {
    

    private static final String USER_ID_KEY = "USER_ID";
    private static final String USER_EMAIL_KEY = "USER_EMAIL";
    private static final String USER_NAME_KEY = "USER_NAME";
    private static final String USER_ROLE_KEY = "USER_ROLE";
    private static final String IS_LOGGED_IN_KEY = "IS_LOGGED_IN";

    /**
     * Create a new session for user after successful login
     */
    public void createUserSession(HttpSession session, User user) {
        // Store user information in session
        session.setAttribute(USER_ID_KEY, user.getId());
        session.setAttribute(USER_EMAIL_KEY, user.getEmail());
        session.setAttribute(USER_NAME_KEY, user.getName());
        session.setAttribute(USER_ROLE_KEY, user.getRole());
        session.setAttribute(IS_LOGGED_IN_KEY, true);
        

        session.setMaxInactiveInterval(1800);
    }

    /**
     * Check if user is logged in
     */
    public boolean isUserLoggedIn(HttpSession session) {
        Boolean isLoggedIn = (Boolean) session.getAttribute(IS_LOGGED_IN_KEY);
        return isLoggedIn != null && isLoggedIn;
    }

    /**
     * Get user ID from session
     */
    public Integer getUserId(HttpSession session) {
        return (Integer) session.getAttribute(USER_ID_KEY);
    }

    /**
     * Get user email from session
     */
    public String getUserEmail(HttpSession session) {
        return (String) session.getAttribute(USER_EMAIL_KEY);
    }

    /**
     * Get user name from session
     */
    public String getUserName(HttpSession session) {
        return (String) session.getAttribute(USER_NAME_KEY);
    }

    /**
     * Get user role from session
     */
    public String getUserRole(HttpSession session) {
        return (String) session.getAttribute(USER_ROLE_KEY);
    }

    /**
     * Logout user by destroying session
     */
    public void logoutUser(HttpSession session) {
        session.invalidate(); // This destroys the entire session
    }

    /**
     * Check if user has specific role
     */
    public boolean hasRole(HttpSession session, String role) {
        String userRole = getUserRole(session);
        return userRole != null && userRole.equalsIgnoreCase(role);
    }
}