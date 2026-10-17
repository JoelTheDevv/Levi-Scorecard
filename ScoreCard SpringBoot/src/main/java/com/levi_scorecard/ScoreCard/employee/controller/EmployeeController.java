package com.levi_scorecard.ScoreCard.employee.controller;

import com.levi_scorecard.ScoreCard.employee.dto.CreateEmployeeRequest;
import com.levi_scorecard.ScoreCard.employee.entity.Employee;
import com.levi_scorecard.ScoreCard.employee.service.EmployeeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @PostMapping
    public Employee createEmployee(
            @RequestBody CreateEmployeeRequest request
    ) {
        return employeeService.createEmployee(
                request.name(),
                request.teamId()
        );
    }

    @PutMapping("/{employeeId}/team/{teamId}")
    public Employee changeTeam(
            @PathVariable Long employeeId,
            @PathVariable Long teamId
    ) {
        return employeeService.changeTeam(employeeId, teamId);
    }

    @PostMapping("/{employeeId}")
    public boolean deleteEmployee(@PathVariable Long employeeId) {
        return employeeService.deleteEmployee(employeeId);
    }
}