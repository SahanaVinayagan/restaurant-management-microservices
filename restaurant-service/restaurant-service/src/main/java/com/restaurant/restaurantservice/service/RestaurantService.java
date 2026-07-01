package com.restaurant.restaurantservice.service;


import com.restaurant.restaurantservice.entity.Restaurant;
import com.restaurant.restaurantservice.entity.AuditLog;
import com.restaurant.restaurantservice.repository.RestaurantRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class RestaurantService {


    private final RestaurantRepository repository;
    private final RestTemplate restTemplate;


    public RestaurantService(
            RestaurantRepository repository,
            RestTemplate restTemplate) {

        this.repository = repository;
        this.restTemplate = restTemplate;
    }



    // Get all restaurants
    public List<Restaurant> getAllRestaurants() {

        return repository.findAll();
    }



    // Add restaurant
    public Restaurant addRestaurant(Restaurant restaurant) {


        Restaurant saved =
                repository.save(restaurant);



        sendAudit(
                "CREATE",
                saved.getId(),
                "Restaurant added"
        );


        return saved;
    }




    // Delete restaurant
    public String deleteRestaurant(Long id) {


        if(repository.existsById(id)) {


            repository.deleteById(id);



            sendAudit(
                    "DELETE",
                    id,
                    "Restaurant deleted"
            );


            return "Restaurant deleted successfully";
        }


        return "Restaurant not found";
    }





    // Update restaurant
    public Restaurant updateRestaurant(
            Long id,
            Restaurant restaurant) {


        Restaurant existing =
                repository.findById(id)
                .orElseThrow(
                () -> new RuntimeException(
                "Restaurant not found"));



        existing.setName(
                restaurant.getName()
        );


        existing.setAddress(
                restaurant.getAddress()
        );


        existing.setCuisine(
                restaurant.getCuisine()
        );



        Restaurant updated =
                repository.save(existing);



        sendAudit(
                "UPDATE",
                id,
                "Restaurant updated"
        );



        return updated;
    }





    // Get by id
    public Restaurant getById(Long id) {


        return repository.findById(id)
                .orElseThrow(
                () -> new RuntimeException(
                "Restaurant not found"));
    }






    // Audit method
    private void sendAudit(
            String action,
            Long id,
            String description) {



        AuditLog log =
                new AuditLog(
                "restaurant-service",
                action,
                "Restaurant",
                id,
                "admin",
                description,
                LocalDateTime.now()
        );



        restTemplate.postForObject(
                "http://audit-service:8084/logs",
                log,
                AuditLog.class
        );
    }

}