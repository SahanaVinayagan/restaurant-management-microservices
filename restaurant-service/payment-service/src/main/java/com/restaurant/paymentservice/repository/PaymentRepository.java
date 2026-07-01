package com.restaurant.paymentservice.repository;

import com.restaurant.paymentservice.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PaymentRepository 
        extends JpaRepository<Payment, Long> {

}