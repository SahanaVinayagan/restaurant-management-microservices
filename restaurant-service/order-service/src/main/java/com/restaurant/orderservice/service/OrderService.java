package com.restaurant.orderservice.service;


import com.restaurant.orderservice.entity.Order;
import com.restaurant.orderservice.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class OrderService {


    private final OrderRepository repository;

    private final AuditClient auditClient;



    public OrderService(
            OrderRepository repository,
            AuditClient auditClient
    ) {

        this.repository = repository;
        this.auditClient = auditClient;
    }



    public List<Order> getAllOrders() {

        return repository.findAll();
    }



    public Order addOrder(Order order) {


        Order saved =
                repository.save(order);



        auditClient.sendAudit(
                "CREATE",
                "Order",
                saved.getId(),
                "Order created"
        );


        return saved;
    }




    public Order getOrderById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));
    }




    public String deleteOrder(Long id) {


        repository.deleteById(id);



        auditClient.sendAudit(
                "DELETE",
                "Order",
                id,
                "Order deleted"
        );



        return "Order Deleted";
    }





    public Order updateOrder(
            Long id,
            Order order
    ) {


        Order existing =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                ));



        existing.setRestaurantId(
                order.getRestaurantId()
        );


        existing.setCustomerName(
                order.getCustomerName()
        );


        existing.setAmount(
                order.getAmount()
        );



        Order updated =
                repository.save(existing);




        auditClient.sendAudit(
                "UPDATE",
                "Order",
                updated.getId(),
                "Order updated"
        );



        return updated;
    }
}