document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const coursesTable = document.getElementById('courses-table').getElementsByTagName('tbody')[0];
    const addCourseBtn = document.getElementById('add-course-btn');
    const courseModal = document.getElementById('course-modal');
    const modalTitle = document.getElementById('modal-title');
    const courseForm = document.getElementById('course-form');
    const closeBtn = courseModal.querySelector('.close-btn');
    const cancelBtn = courseModal.querySelector('.cancel-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const save = document.getElementsByClassName('submit-btn')[0];
    
    let courses = [];
    let instructors = [];
    
    // Fetch all courses
    function fetchCourses() {
        fetch('/api/courses')
            .then(response => response.json())
            .then(data => {
                courses = data;
                renderCoursesTable(courses);
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            });
    }
    
    // Fetch all instructors for the dropdown
    function fetchInstructors() {
        fetch('/api/instructors')
            .then(response => response.json())
            .then(data => {
                instructors = data;
                populateInstructorDropdown();
            })
            .catch(error => {
                console.error('Error fetching instructors:', error);
            });
    }
    
    // Render courses table
    function renderCoursesTable(coursesData) {
        coursesTable.innerHTML = '';
        
        if (coursesData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="7" class="text-center">No courses found</td>';
            coursesTable.appendChild(row);
            return;
        }
        
        coursesData.forEach(course => {
            const row = document.createElement('tr');
            
            // Format dates
            const startDate = course.start_date ? new Date(course.start_date).toLocaleDateString() : '-';
            const endDate = course.end_date ? new Date(course.end_date).toLocaleDateString() : '-';
            
            row.innerHTML = `
                <td>${course.course_id}</td>
                <td>${course.course_name}</td>
                <td>${course.instructor_name || '-'}</td>
                <td>${course.category || '-'}</td>
                <td>${startDate}</td>
                <td>${endDate}</td>
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
            viewBtn.addEventListener('click', () => openViewCourseModal(course));

            const editBtn = row.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => openEditCourseModal(course));
            
            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteCourse(course.course_id));
            
            coursesTable.appendChild(row);
        });
    }
    
    // Populate instructor dropdown
    function populateInstructorDropdown() {
        const instructorSelect = document.getElementById('course-instructor');
        instructorSelect.innerHTML = '<option value="">Select Instructor</option>';
        
        instructors.forEach(instructor => {
            const option = document.createElement('option');
            option.value = instructor.instructor_id;
            option.textContent = `${instructor.first_name} ${instructor.last_name}`;
            instructorSelect.appendChild(option);
        });
    }
    
    // Open add course modal
    function openAddCourseModal() {
        
        document.getElementById('course-id').disabled = false;
        document.getElementById('course-name').disabled = false;
        document.getElementById('course-description').disabled = false;
        document.getElementById('course-instructor').disabled = false;
        document.getElementById('course-category').disabled = false;
        document.getElementById('course-start-date').disabled = false;
        document.getElementById('course-end-date').disabled = false;
        
        save.hidden=false;

        modalTitle.textContent = 'Add Course';
        courseForm.reset();
        document.getElementById('course-id').value = '';
        courseModal.style.display = 'block';
    }

     // Open view course modal
     function openViewCourseModal(course) {
        modalTitle.textContent = 'View Course';

        document.getElementById('course-id').disabled = true;
        document.getElementById('course-name').disabled = true;
        document.getElementById('course-description').disabled = true;
        document.getElementById('course-instructor').disabled = true;
        document.getElementById('course-category').disabled = true;
        document.getElementById('course-start-date').disabled = true;
        document.getElementById('course-end-date').disabled = true;

        save.hidden=true;
        
        // Fill form with course data
        document.getElementById('course-id').value = course.course_id;
        document.getElementById('course-name').value = course.course_name;
        document.getElementById('course-description').value = course.description || '';
        document.getElementById('course-instructor').value = course.instructor_id || '';
        document.getElementById('course-category').value = course.category || '';
        
        if (course.start_date) {
            document.getElementById('course-start-date').value = new Date(course.start_date).toISOString().split('T')[0];
        } else {
            document.getElementById('course-start-date').value = '';
        }
        
        if (course.end_date) {
            document.getElementById('course-end-date').value = new Date(course.end_date).toISOString().split('T')[0];
        } else {
            document.getElementById('course-end-date').value = '';
        }
        
        courseModal.style.display = 'block';
    }
    
    // Open edit course modal
    function openEditCourseModal(course) {
        modalTitle.textContent = 'Edit Course';
        
        document.getElementById('course-id').disabled = false;
        document.getElementById('course-name').disabled = false;
        document.getElementById('course-description').disable = false;
        document.getElementById('course-instructor').disabled = false;
        document.getElementById('course-category').disabled = false;
        document.getElementById('course-start-date').disabled = false;
        document.getElementById('course-end-date').disabled = false;

        save.hidden=false;
        
        // Fill form with course data
        document.getElementById('course-id').value = course.course_id;
        document.getElementById('course-name').value = course.course_name;
        document.getElementById('course-description').value = course.description || '';
        document.getElementById('course-instructor').value = course.instructor_id || '';
        document.getElementById('course-category').value = course.category || '';
        
        if (course.start_date) {
            document.getElementById('course-start-date').value = new Date(course.start_date).toISOString().split('T')[0];
        } else {
            document.getElementById('course-start-date').value = '';
        }
        
        if (course.end_date) {
            document.getElementById('course-end-date').value = new Date(course.end_date).toISOString().split('T')[0];
        } else {
            document.getElementById('course-end-date').value = '';
        }
        
        courseModal.style.display = 'block';
    }
    
    // Close modal
    function closeModal() {
        courseModal.style.display = 'none';
    }
    
    // Add new course
    function addCourse(formData) {
        fetch('/api/courses', {
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
                fetchCourses();
                alert('Course added successfully!');
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error adding course:', error);
            alert('An error occurred while adding the course.');
        });
    }
    
    // Update course
    function updateCourse(courseId, formData) {
        fetch(`/api/courses/${courseId}`, {
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
                fetchCourses();
                alert('Course updated successfully!');
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error updating course:', error);
            alert('An error occurred while updating the course.');
        });
    }
    
    // Delete course
    function deleteCourse(courseId) {
        if (confirm('Are you sure you want to delete this course?')) {
            fetch(`/api/courses/${courseId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchCourses();
                    alert('Course deleted successfully!');
                } else {
                    alert('Error: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error deleting course:', error);
                alert('An error occurred while deleting the course.');
            });
        }
    }
    
    // Search courses
    function searchCourses() {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (searchTerm === '') {
            renderCoursesTable(courses);
            return;
        }
        
        const filteredCourses = courses.filter(course => {
            return (
                course.course_id.toString().includes(searchTerm) ||
                course.course_name.toLowerCase().includes(searchTerm) ||
                (course.instructor_name && course.instructor_name.toLowerCase().includes(searchTerm)) ||
                (course.category && course.category.toLowerCase().includes(searchTerm))
            );
        });
        
        renderCoursesTable(filteredCourses);
    }
    
    // Event listeners
    addCourseBtn.addEventListener('click', openAddCourseModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    searchBtn.addEventListener('click', searchCourses);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchCourses();
        }
    });
    
    courseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = {
            course_name: document.getElementById('course-name').value,
            description: document.getElementById('course-description').value || null,
            instructor_id: document.getElementById('course-instructor').value || null,
            category: document.getElementById('course-category').value || null,
            start_date: document.getElementById('course-start-date').value || null,
            end_date: document.getElementById('course-end-date').value || null
        };
        
        const courseId = document.getElementById('course-id').value;
        
        if (courseId) {
            updateCourse(courseId, formData);
        } else {
            addCourse(formData);
        }
    });
    
    // Initial fetch
    fetchCourses();
    fetchInstructors();
});