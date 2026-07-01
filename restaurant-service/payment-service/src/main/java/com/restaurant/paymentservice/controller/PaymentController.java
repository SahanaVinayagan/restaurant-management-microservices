package com.restaurant.paymentservice.controller;


import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.restaurant.paymentservice.entity.Payment;
import com.restaurant.paymentservice.service.PaymentService;


@RestController
@RequestMapping("/payments")
public class PaymentController {


    private final PaymentService service;


    public PaymentController(PaymentService service){
        this.service = service;
    }


    @GetMapping
    public List<Payment> getPayments(){
        return service.getAll();
    }


    @PostMapping
    public Payment addPayment(
            @RequestBody Payment payment){

        return service.save(payment);
    }

}