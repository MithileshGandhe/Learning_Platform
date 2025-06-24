document.addEventListener('DOMContentLoaded', function() {
    // Fetch dashboard data
    fetch('/api/dashboard')
        .then(response => response.json())
        .then(data => {
            // Update stat cards
            document.querySelector('#student-count .stat-number').textContent = data.counts.students;
            document.querySelector('#instructor-count .stat-number').textContent = data.counts.instructors;
            document.querySelector('#course-count .stat-number').textContent = data.counts.courses;
            document.querySelector('#enrollment-count .stat-number').textContent = data.counts.enrollments;
            document.querySelector('#assessment-count .stat-number').textContent = data.counts.assessments;
            
            // Update recent enrollments
            const recentEnrollmentsList = document.getElementById('recent-enrollments');
            recentEnrollmentsList.innerHTML = '';
            
            if (data.recent_enrollments.length === 0) {
                recentEnrollmentsList.innerHTML = '<li>No recent enrollments</li>';
            } else {
                data.recent_enrollments.forEach(enrollment => {
                    const enrollmentDate = new Date(enrollment.Enrollment_date);
                    const formattedDate = enrollmentDate.toLocaleDateString();
                    
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>${enrollment.Student_name}</strong> enrolled in 
                        <strong>${enrollment.course_name}</strong>
                        <div class="text-muted">${formattedDate}</div>
                    `;
                    recentEnrollmentsList.appendChild(li);
                });
            }
            
            // Update upcoming assessments
            const upcomingAssessmentsList = document.getElementById('upcoming-assessments');
            upcomingAssessmentsList.innerHTML = '';
            
            if (data.upcoming_assessments.length === 0) {
                upcomingAssessmentsList.innerHTML = '<li>No upcoming assessments</li>';
            } else {
                data.upcoming_assessments.forEach(assessment => {
                    const dueDate = new Date(assessment.due_date);
                    const formattedDate = dueDate.toLocaleDateString();
                    
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>${assessment.title}</strong>
                        <div>${assessment.course_name}</div>
                        <div class="text-muted">Due: ${formattedDate}</div>
                    `;
                    upcomingAssessmentsList.appendChild(li);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching dashboard data:', error);
        });
});