package com.restaurant.auditservice.controller;

import com.restaurant.auditservice.entity.AuditLog;
import com.restaurant.auditservice.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/logs")
@CrossOrigin(origins = "*")
public class AuditController {

    @Autowired
    private AuditService auditService;

    @PostMapping
    public AuditLog saveLog(@RequestBody AuditLog log) {

        return auditService.saveLog(log);
    }

    @GetMapping
    public List<AuditLog> getAllLogs() {

        return auditService.getAllLogs();
    }

    @GetMapping("/{id}")
    public AuditLog getLog(@PathVariable Long id) {

        return auditService.getLogById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteLog(@PathVariable Long id) {

        auditService.deleteLog(id);

        return "Audit log deleted successfully.";
    }
}