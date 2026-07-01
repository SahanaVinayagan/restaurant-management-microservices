package com.restaurant.paymentservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuditClient {

    private static final Logger logger = LoggerFactory.getLogger(AuditClient.class);
    private final RestTemplate restTemplate = new RestTemplate();

    public void sendAudit(String action, String entityName, Long entityId, String description) {
        Map<String, Object> log = new HashMap<>();
        log.put("serviceName", "payment-service");
        log.put("action", action);
        log.put("entityName", entityName);
        log.put("entityId", entityId);
        log.put("username", "admin");
        log.put("description", description);
        log.put("timestamp", LocalDateTime.now().toString());

        try {
            restTemplate.postForObject("http://audit-service:8084/logs", log, Object.class);
            logger.info("Payment audit sent: {} {} {}", action, entityName, entityId);
        } catch (RestClientException ex) {
            logger.error("Failed to send payment audit log", ex);
        }
    }
}
