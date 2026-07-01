package com.restaurant.paymentservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.restaurant.paymentservice.entity.Payment;
import com.restaurant.paymentservice.repository.PaymentRepository;
import com.restaurant.paymentservice.service.AuditClient;


@Service
public class PaymentService {

    private final PaymentRepository repo;
    private final AuditClient auditClient;


    public PaymentService(PaymentRepository repo, AuditClient auditClient){
        this.repo = repo;
        this.auditClient = auditClient;
    }


    public List<Payment> getAll(){
        return repo.findAll();
    }


    public Payment save(Payment payment){
        payment.setStatus("SUCCESS");
        Payment saved = repo.save(payment);
        auditClient.sendAudit(
                "CREATE",
                "Payment",
                saved.getId(),
                "Recorded payment for order " + saved.getOrderId() + " amount " + saved.getAmount()
        );
        return saved;
    }
}