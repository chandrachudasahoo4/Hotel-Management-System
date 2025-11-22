package org.hotelms.controller;

import java.util.*;

import org.hotelms.entity.LoginRequest;
import org.hotelms.entity.LoginResponse;
import org.hotelms.entity.User;
import org.hotelms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;


    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request, HttpSession session) {
        return userService.login(request.getEmail(), request.getPassword(), session);
    }


    @PostMapping("/logout")
    public Map<String, String> logout(HttpSession session) {
        return userService.logout(session);
    }


    @GetMapping("/session")
    public Map<String, Object> getSessionInfo(HttpSession session) {
        return userService.getSessionInfo(session);
    }


    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String firstName = body.get("firstName");
        String lastName = body.get("lastName");
        String phone = body.get("phone_number");

        Map<String, String> res = new HashMap<>();


        if (userService.existsByEmail(email)) {
            res.put("status", "error");
            res.put("message", "Email already registered");
            return res;
        }


        User user = new User();
        user.setEmail(email);
        user.setName(firstName + " " + lastName);
        user.setPassword(password);
        user.setPhone_number(phone);
        user.setRole("CUSTOMER");


        return userService.registerUser(user);
    }


    @PostMapping("/register/reception")
    public Map<String, String> registerReception(@RequestBody Map<String, String> body, HttpSession session) {
        Map<String, String> res = new HashMap<>();


        if (!userService.isAdminLoggedIn(session)) {
            res.put("status", "error");
            res.put("message", "Access denied. Admin role required.");
            return res;
        }

        String email = body.get("email");
        String password = body.get("password");
        String firstName = body.get("firstName");
        String lastName = body.get("lastName");
        String phone = body.get("phone_number");


        if (userService.existsByEmail(email)) {
            res.put("status", "error");
            res.put("message", "Email already registered");
            return res;
        }


        User user = new User();
        user.setEmail(email);
        user.setName(firstName + " " + lastName);
        user.setPassword(password);
        user.setPhone_number(phone);
        user.setRole("RECEPTION");


        return userService.registerReceptionUser(user);
    }
}
