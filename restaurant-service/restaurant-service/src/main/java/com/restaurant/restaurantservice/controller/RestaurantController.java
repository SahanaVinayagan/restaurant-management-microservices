package com.restaurant.restaurantservice.controller;

import com.restaurant.restaurantservice.entity.Restaurant;
import com.restaurant.restaurantservice.service.RestaurantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/restaurants")
public class RestaurantController {


    private final RestaurantService service;


    public RestaurantController(RestaurantService service) {
        this.service = service;
    }

    @GetMapping
    public List<Restaurant> getAllRestaurants(){

        return service.getAllRestaurants();
    }

    @PostMapping
    public Restaurant addRestaurant(@RequestBody Restaurant restaurant){

        return service.addRestaurant(restaurant);
    }

    @DeleteMapping("/{id}")
    public String deleteRestaurant(@PathVariable Long id){

        return service.deleteRestaurant(id);
    }

    @PutMapping("/{id}")
    public Restaurant updateRestaurant(
        @PathVariable Long id,
        @RequestBody Restaurant restaurant){

        return service.updateRestaurant(id, restaurant);
    }

    @GetMapping("/{id}")
    public Restaurant getById(@PathVariable Long id){

        return service.getById(id);
    }

}