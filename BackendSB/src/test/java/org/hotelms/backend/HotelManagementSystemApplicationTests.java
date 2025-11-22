package org.hotelms.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class HotelManagementSystemApplicationTests {

    @Test
    void contextLoads() {
        // Test that the Spring context loads successfully
        assertTrue(true, "Application context should load without errors");
    }

    @Test
    void applicationStartsSuccessfully() {
        // Test that the application can start
        assertTrue(true, "Application should start successfully");
    }
}
