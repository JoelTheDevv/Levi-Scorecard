package com.levi_scorecard.ScoreCard.employee.repository;

import com.levi_scorecard.ScoreCard.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}