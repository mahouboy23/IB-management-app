import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

function OverviewPage() {
  const [dashboardData, setDashboardData] = useState({
    userCounts: [],
    classCount: 0,
    recentClasses: [],
    recentGrades: [],
  });
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [classPerformance, setClassPerformance] = useState([]);

  useEffect(() => {
    const fetchDashboardOverview = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard overview:', error);
      }
    };

    fetchDashboardOverview();
  }, []);

  useEffect(() => {
    const fetchClassPerformanceReport = async () => {
      if (selectedClassId) {
        try {
          const response = await axios.get(`/api/grades/report?classId=${selectedClassId}`);
          setClassPerformance(response.data.grades);
        } catch (error) {
          console.error('Error fetching class performance report:', error);
        }
      }
    };

    fetchClassPerformanceReport();
  }, [selectedClassId]);

  // Example data for a bar chart
  const chartData = {
    labels: dashboardData.recentClasses.map((cls) => cls.class_name),
    datasets: [
      {
        label: 'Recent Classes',
        data: dashboardData.recentClasses.map((cls) => cls.student_count),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="overview-container">
      <h1>Dashboard Overview</h1>
      <div className="user-counts-section">
        <h2>User Counts</h2>
        {dashboardData.userCounts.map((count) => (
          <p key={count.role}>{`${count.role}: ${count.count}`}</p>
        ))}
      </div>
      <div className="class-count-section">
        <h2>Class Count</h2>
        <p>{`Total classes: ${dashboardData.classCount}`}</p>
      </div>
      <div className="recent-activities-section">
        <h2>Recent Activities</h2>
        {dashboardData.recentClasses.map((cls) => (
          <div key={cls.class_id}>
            <p>{`Class Name: ${cls.class_name}`}</p>
          </div>
        ))}
      </div>
      <div className="recent-grades-section">
        <h2>Recent Grades</h2>
        {dashboardData.recentGrades.map((grade) => (
          <div key={grade.grade_id}>
            <p>{`Student: ${grade.full_name}, Grade: ${grade.grade_value}`}</p>
          </div>
        ))}
      </div>
      <div className="class-performance-section">
        <h2>Class Performance Report</h2>
        <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
          {/* Options for class selection */}
        </select>
        {/* Render class performance details */}
      </div>
      <div className="graphs-section">
      <h2>Graphs</h2>
      {dashboardData && dashboardData.recentClasses && dashboardData.recentClasses.length > 0 && (
        <Bar data={chartData} />
      )}
    </div>
  </div>
  );
}

export default OverviewPage;
