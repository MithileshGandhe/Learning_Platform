document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const enrollmentsTable = document.getElementById('enrollments-table').getElementsByTagName('tbody')[0];
    const addEnrollmentBtn = document.getElementById('add-enrollment-btn');
    const enrollmentModal = document.getElementById('enrollment-modal');
    const modalTitle = document.getElementById('modal-title');
    const enrollmentForm = document.getElementById('enrollment-form');
    const closeBtn = enrollmentModal.querySelector('.close-btn');
    const cancelBtn = enrollmentModal.querySelector('.cancel-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const save = document.getElementsByClassName('submit-btn')[0];
    
    let enrollments = [];
    let students = [];
    let courses = [];
    
    // Fetch all enrollments
    function fetchEnrollments() {
        fetch('/api/enrollments')
            .then(response => response.json())
            .then(data => {
                enrollments = data;
                renderEnrollmentsTable(enrollments);
            })
            .catch(error => {
                console.error('Error fetching enrollments:', error);
            });
    }
    
    // Fetch all students for the dropdown
    function fetchStudents() {
        fetch('/api/students')
            .then(response => response.json())
            .then(data => {
                students = data;
                populateStudentDropdown();
            })
            .catch(error => {
                console.error('Error fetching students:', error);
            });
    }
    
    // Fetch all courses for the dropdown
    function fetchCourses() {
        fetch('/api/courses')
            .then(response => response.json())
            .then(data => {
                courses = data;
                populateCourseDropdown();
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            });
    }
    
    // Render enrollments table
    function renderEnrollmentsTable(enrollmentsData) {
        enrollmentsTable.innerHTML = '';
        
        if (enrollmentsData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="7" class="text-center">No enrollments found</td>';
            enrollmentsTable.appendChild(row);
            return;
        }
        
        enrollmentsData.forEach(enrollment => {
            const row = document.createElement('tr');
            
            // Format date
            const enrollmentDate = enrollment.Enrollment_date ? new Date(enrollment.Enrollment_date).toLocaleDateString() : '-';
            
            // Create status badge
            const statusClass = 
                enrollment.Status === 'Active' ? 'status-active' :
                enrollment.Status === 'Dropped' ? 'status-dropped' :
                enrollment.Status === 'Completed' ? 'status-completed' :
                'status-waitlisted';
            
            row.innerHTML = `
                <td>${enrollment.Enrollment_id}</td>
                <td>${enrollment.Student_name}</td>
                <td>${enrollment.course_name}</td>
                <td>${enrollmentDate}</td>
                <td><span class="status-badge ${statusClass}">${enrollment.Status}</span></td>
                <td>${enrollment.Grade || '-'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="view-btn"><i class="fas fa-eye"></i></button>
                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            
            // Add event listeners to buttons
            const viewBtn = row.querySelector('.view-btn');
            viewBtn.addEventListener('click', () => openViewEnrollmentModal(enrollment));

            const editBtn = row.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => openEditEnrollmentModal(enrollment));
            
            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteEnrollment(enrollment.Enrollment_id));
            
            enrollmentsTable.appendChild(row);
        });
    }
    
    // Populate student dropdown
    function populateStudentDropdown() {
        const studentSelect = document.getElementById('enrollment-student');
        studentSelect.innerHTML = '<option value="">Select Student</option>';
        
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.Student_id;
            option.textContent = student.Student_name;
            studentSelect.appendChild(option);
        });
    }
    
    // Populate course dropdown
    function populateCourseDropdown() {
        const courseSelect = document.getElementById('enrollment-course');
        courseSelect.innerHTML = '<option value="">Select Course</option>';
        
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.course_id;
            option.textContent = course.course_name;
            courseSelect.appendChild(option);
        });
    }
    
    // Open add enrollment modal
    function openAddEnrollmentModal() {
        
        document.getElementById('enrollment-student').disabled = false;
        document.getElementById('enrollment-course').disabled = false;
        document.getElementById('enrollment-date').disabled = false;    
        document.getElementById('enrollment-status').disabled = false;
        document.getElementById('enrollment-grade').disabled = false;

        save.hidden=false;


        modalTitle.textContent = 'Add Enrollment';
        enrollmentForm.reset();
        document.getElementById('enrollment-id').disabled = false;
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('enrollment-date').value = today;
        
        enrollmentModal.style.display = 'block';
    }
    
    // Open view enrollment modal
    function openViewEnrollmentModal(enrollment) {

        document.getElementById('enrollment-student').disabled = true;
        document.getElementById('enrollment-course').disabled = true;
        document.getElementById('enrollment-date').disabled = true;    
        document.getElementById('enrollment-status').disabled = true;
        document.getElementById('enrollment-grade').disabled = true;

        save.hidden=true;

        modalTitle.textContent = 'View Enrollment';
        
        // Fill form with enrollment data
        document.getElementById('enrollment-id').value = enrollment.Enrollment_id;
        document.getElementById('enrollment-id').disabled = true;
        document.getElementById('enrollment-student').value = enrollment.Student_id;
        document.getElementById('enrollment-course').value = enrollment.Course_id;
        
        if (enrollment.Enrollment_date) {
            document.getElementById('enrollment-date').value = new Date(enrollment.Enrollment_date).toISOString().split('T')[0];
        } else {
            document.getElementById('enrollment-date').value = '';
        }
        
        document.getElementById('enrollment-status').value = enrollment.Status;
        document.getElementById('enrollment-grade').value = enrollment.Grade || '';
        
        enrollmentModal.style.display = 'block';
    }

    // Open edit enrollment modal
    function openEditEnrollmentModal(enrollment) {

        document.getElementById('enrollment-student').disabled = false;
        document.getElementById('enrollment-course').disabled = false;
        document.getElementById('enrollment-date').disabled = false;    
        document.getElementById('enrollment-status').disabled = false;
        document.getElementById('enrollment-grade').disabled = false;

        save.hidden=false;


        modalTitle.textContent = 'Edit Enrollment';
        
        // Fill form with enrollment data
        document.getElementById('enrollment-id').value = enrollment.Enrollment_id;
        document.getElementById('enrollment-id').disabled = true;
        document.getElementById('enrollment-student').value = enrollment.Student_id;
        document.getElementById('enrollment-course').value = enrollment.Course_id;
        
        if (enrollment.Enrollment_date) {
            document.getElementById('enrollment-date').value = new Date(enrollment.Enrollment_date).toISOString().split('T')[0];
        } else {
            document.getElementById('enrollment-date').value = '';
        }
        
        document.getElementById('enrollment-status').value = enrollment.Status;
        document.getElementById('enrollment-grade').value = enrollment.Grade || '';
        
        enrollmentModal.style.display = 'block';
    }
    
    // Close modal
    function closeModal() {
        enrollmentModal.style.display = 'none';
    }
    
    // Add new enrollment
    function addEnrollment(formData) {
        fetch('/api/enrollments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeModal();
                fetchEnrollments();
                alert('Enrollment added successfully!');
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error adding enrollment:', error);
            alert('An error occurred while adding the enrollment.');
        });
    }
    
    // Update enrollment
    function updateEnrollment(enrollmentId, formData) {
        fetch(`/api/enrollments/${enrollmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeModal();
                fetchEnrollments();
                alert('Enrollment updated successfully!');
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error updating enrollment:', error);
            alert('An error occurred while updating the enrollment.');
        });
    }
    
    // Delete enrollment
    function deleteEnrollment(enrollmentId) {
        if (confirm('Are you sure you want to delete this enrollment?')) {
            fetch(`/api/enrollments/${enrollmentId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchEnrollments();
                    alert('Enrollment deleted successfully!');
                } else {
                    alert('Error: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error deleting enrollment:', error);
                alert('An error occurred while deleting the enrollment.');
            });
        }
    }
    
    // Search enrollments
    function searchEnrollments() {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (searchTerm === '') {
            renderEnrollmentsTable(enrollments);
            return;
        }
        
        const filteredEnrollments = enrollments.filter(enrollment => {
            return (
                enrollment.Enrollment_id.toString().includes(searchTerm) ||
                enrollment.Student_name.toLowerCase().includes(searchTerm) ||
                enrollment.course_name.toLowerCase().includes(searchTerm) ||
                enrollment.Status.toLowerCase().includes(searchTerm) ||
                (enrollment.Grade && enrollment.Grade.toLowerCase().includes(searchTerm))
            );
        });
        
        renderEnrollmentsTable(filteredEnrollments);
    }
    
    // Event listeners
    addEnrollmentBtn.addEventListener('click', openAddEnrollmentModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    searchBtn.addEventListener('click', searchEnrollments);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchEnrollments();
        }
    });
    
    enrollmentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = {
            enrollment_id: document.getElementById('enrollment-id').value,
            student_id: document.getElementById('enrollment-student').value,
            course_id: document.getElementById('enrollment-course').value,
            enrollment_date: document.getElementById('enrollment-date').value,
            status: document.getElementById('enrollment-status').value,
            grade: document.getElementById('enrollment-grade').value || null
        };
        
        if (document.getElementById('enrollment-id').disabled) {
            updateEnrollment(formData.enrollment_id, formData);
        } else {
            addEnrollment(formData);
        }
    });
    
    // Initial fetch
    fetchEnrollments();
    fetchStudents();
    fetchCourses();
});