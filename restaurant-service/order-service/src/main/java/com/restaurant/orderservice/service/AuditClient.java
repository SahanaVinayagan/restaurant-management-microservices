package com.restaurant.orderservice.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuditClient {


    private final RestTemplate restTemplate =
            new RestTemplate();


    public void sendAudit(
            String action,
            String entityName,
            Long entityId,
            String description
    ) {


        Map<String, Object> log = new HashMap<>();

        log.put("serviceName", "order-service");
        log.put("action", action);
        log.put("entityName", entityName);
        log.put("entityId", entityId);
        log.put("username", "admin");
        log.put("description", description);
        log.put("timestamp", LocalDateTime.now());


        restTemplate.postForObject(
                "http://audit-service:8084/logs",
                log,
                Object.class
        );
    }
}