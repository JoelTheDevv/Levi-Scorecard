package com.levi_scorecard.ScoreCard.employee.service;

import com.levi_scorecard.ScoreCard.employee.entity.Employee;
import com.levi_scorecard.ScoreCard.employee.repository.EmployeeRepository;
import com.levi_scorecard.ScoreCard.team.entity.Team;
import com.levi_scorecard.ScoreCard.team.repository.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final TeamRepository teamRepository;

    public EmployeeService(
            EmployeeRepository employeeRepository,
            TeamRepository teamRepository
    ) {
        this.employeeRepository = employeeRepository;
        this.teamRepository = teamRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findByDeletedFalse();
    }

    public Employee createEmployee(String name, Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        Employee employee = new Employee(name, team);

        return employeeRepository.save(employee);
    }

    public Employee changeTeam(Long employeeId, Long teamId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        employee.setTeam(team);

        return employeeRepository.save(employee);
    }

    @Transactional
    public boolean deleteEmployee(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new NoSuchElementException("Employee not found with ID: " + employeeId));
        employee.setDeleted(true);
        employeeRepository.save(employee);
        return true;
    }
}