package com.kirankandula.BillingApplication.Dtos;

import com.kirankandula.BillingApplication.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public DashboardResponse getDashboardData(){
        LocalDate today=LocalDate.now();
        Double todaysSale=orderService.sumSalesByDate(today);
        Long todaysOrdersCount=orderService.countByOrderDate(today);
        List<OrderResponse> recentOrders= orderService.findRecentOrders();
        return new DashboardResponse(todaysSale!=null?todaysSale:0.0,
                todaysOrdersCount!=null?todaysOrdersCount:0,
                recentOrders);
    }


}
