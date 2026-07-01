package com.restaurant.restaurantservice.entity;


import java.time.LocalDateTime;



public class AuditLog {


    private String serviceName;

    private String action;

    private String entityName;

    private Long entityId;

    private String username;

    private String description;

    private LocalDateTime timestamp;



    public AuditLog() {

    }




    public AuditLog(
            String serviceName,
            String action,
            String entityName,
            Long entityId,
            String username,
            String description,
            LocalDateTime timestamp) {


        this.serviceName = serviceName;
        this.action = action;
        this.entityName = entityName;
        this.entityId = entityId;
        this.username = username;
        this.description = description;
        this.timestamp = timestamp;
    }




    public String getServiceName() {
        return serviceName;
    }


    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }


    public String getAction() {
        return action;
    }


    public void setAction(String action) {
        this.action = action;
    }


    public String getEntityName() {
        return entityName;
    }


    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }


    public Long getEntityId() {
        return entityId;
    }


    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }


    public String getUsername() {
        return username;
    }


    public void setUsername(String username) {
        this.username = username;
    }


    public String getDescription() {
        return description;
    }


    public void setDescription(String description) {
        this.description = description;
    }


    public LocalDateTime getTimestamp() {
        return timestamp;
    }


    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

}