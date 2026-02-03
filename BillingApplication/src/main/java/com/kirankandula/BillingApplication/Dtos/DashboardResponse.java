package com.kirankandula.BillingApplication.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
    private Double todaySales;
    private Long todayOrdersCount;
    private List<OrderResponse> recentOrders;
}
