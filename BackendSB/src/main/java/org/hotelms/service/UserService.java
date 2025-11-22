package org.hotelms.service;

import java.util.*;

import org.hotelms.entity.LoginResponse;
import org.hotelms.entity.User;
import org.hotelms.repository.UserRepository;
import org.hotelms.security.SessionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpSession;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionManager sessionManager;

    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
    
    public Optional<User> getUserById(int userId) {
        return userRepository.findById(userId);
    }


    public LoginResponse login(String email, String password, HttpSession session) {
        LoginResponse res = new LoginResponse();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            res.setStatus("error");
            res.setMessage("User not found");
            return res;
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(password)) {
            res.setStatus("error");
            res.setMessage("Invalid password");
            return res;
        }


        sessionManager.createUserSession(session, user);


        res.setStatus("success");
        res.setMessage("Login successful");
        res.setRole(user.getRole());
        res.setSessionId(session.getId()); // Get session ID
        res.setUserId(user.getId());
        res.setUserName(user.getName());
        
        return res;
    }

    public Map<String, String> logout(HttpSession session) {
        Map<String, String> res = new HashMap<>();
        
        if (sessionManager.isUserLoggedIn(session)) {
            sessionManager.logoutUser(session);
            res.put("status", "success");
            res.put("message", "Logout successful");
        } else {
            res.put("status", "error");
            res.put("message", "No active session found");
        }
        
        return res;
    }

    public Map<String, Object> getSessionInfo(HttpSession session) {
        Map<String, Object> res = new HashMap<>();
        
        if (sessionManager.isUserLoggedIn(session)) {
            res.put("status", "success");
            res.put("isLoggedIn", true);
            res.put("userId", sessionManager.getUserId(session));
            res.put("userName", sessionManager.getUserName(session));
            res.put("userEmail", sessionManager.getUserEmail(session));
            res.put("userRole", sessionManager.getUserRole(session));
            res.put("sessionId", session.getId());
        } else {
            res.put("status", "error");
            res.put("isLoggedIn", false);
            res.put("message", "No active session");
        }
        
        return res;
    }

    public Map<String, String> registerUser(User user) {
        Map<String, String> res = new HashMap<>();

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            res.put("status", "error");
            res.put("message", "Email already registered");
            return res;
        }

        user.setRole("CUSTOMER");
        userRepository.save(user);

        res.put("status", "success");
        res.put("message", "Registration successful");
        return res;
    }


    public boolean isAdminLoggedIn(HttpSession session) {
        if (!sessionManager.isUserLoggedIn(session)) {
            return false;
        }
        String userRole = sessionManager.getUserRole(session);
        return "ADMIN".equals(userRole);
    }


    public Map<String, String> registerReceptionUser(User user) {
        Map<String, String> res = new HashMap<>();

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            res.put("status", "error");
            res.put("message", "Email already registered");
            return res;
        }

        user.setRole("RECEPTION");
        userRepository.save(user);

        res.put("status", "success");
        res.put("message", "Reception staff registered successfully");
        return res;
    }
}
