package com.restaurant.auditservice.service;

import com.restaurant.auditservice.entity.AuditLog;
import com.restaurant.auditservice.repository.AuditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditService {

    @Autowired
    private AuditRepository repository;

    public AuditLog saveLog(AuditLog log) {

        log.setTimestamp(LocalDateTime.now());

        return repository.save(log);
    }

    public List<AuditLog> getAllLogs() {

        return repository.findAll();
    }

    public AuditLog getLogById(Long id) {

        return repository.findById(id).orElse(null);
    }

    public void deleteLog(Long id) {

        repository.deleteById(id);
    }
}