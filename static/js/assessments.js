document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const assessmentsTable = document.getElementById('assessments-table').getElementsByTagName('tbody')[0];
    const addAssessmentBtn = document.getElementById('add-assessment-btn');
    const assessmentModal = document.getElementById('assessment-modal');
    const modalTitle = document.getElementById('modal-title');
    const assessmentForm = document.getElementById('assessment-form');
    const closeBtn = assessmentModal.querySelector('.close-btn');
    const cancelBtn = assessmentModal.querySelector('.cancel-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const save = document.getElementsByClassName('submit-btn')[0];
    
    let assessments = [];
    let courses = [];
    
    // Fetch all assessments
    function fetchAssessments() {
        fetch('/api/assessments')
            .then(response => response.json())
            .then(data => {
                assessments = data;
                renderAssessmentsTable(assessments);
            })
            .catch(error => {
                console.error('Error fetching assessments:', error);
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
    
    // Render assessments table
    function renderAssessmentsTable(assessmentsData) {
        assessmentsTable.innerHTML = '';
        
        if (assessmentsData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" class="text-center">No assessments found</td>';
            assessmentsTable.appendChild(row);
            return;
        }
        
        assessmentsData.forEach(assessment => {
            const row = document.createElement('tr');
            
            // Format date
            const dueDate = assessment.due_date ? new Date(assessment.due_date).toLocaleDateString() : '-';
            
            row.innerHTML = `
                <td>${assessment.assessment_id}</td>
                <td>${assessment.course_name}</td>
                <td>${assessment.title}</td>
                <td>${dueDate}</td>
                <td>${assessment.max_score}</td>
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
            viewBtn.addEventListener('click', () => openViewAssessmentModal(assessment));

            const editBtn = row.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => openEditAssessmentModal(assessment));
            
            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteAssessment(assessment.assessment_id));
            
            assessmentsTable.appendChild(row);
        });
    }
    
    // Populate course dropdown
    function populateCourseDropdown() {
        const courseSelect = document.getElementById('assessment-course');
        courseSelect.innerHTML = '<option value="">Select Course</option>';
        
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.course_id;
            option.textContent = course.course_name;
            courseSelect.appendChild(option);
        });
    }
    
    // Open add assessment modal
    function openAddAssessmentModal() {
        modalTitle.textContent = 'Add Assessment';
        assessmentForm.reset();
        
        document.getElementById('assessment-id').disabled = false;
        document.getElementById('assessment-course').disabled = false;
        document.getElementById('assessment-title').disabled = false;
        document.getElementById('assessment-description').disabled = false;
        document.getElementById('assessment-due-date').disabled = false;
        document.getElementById('assessment-max-score').disabled = false;

        save.hidden=false;

        document.getElementById('assessment-id').value = '';
        assessmentModal.style.display = 'block';
    }

    // Open view assessment modal
    function openViewAssessmentModal(assessment) {
        modalTitle.textContent = 'View Assessment';
        
        // Fill form with assessment data
        document.getElementById('assessment-id').value = assessment.assessment_id;
        document.getElementById('assessment-id').disabled = true;
        document.getElementById('assessment-course').value = assessment.course_id;
        document.getElementById('assessment-course').disabled = true;
        document.getElementById('assessment-title').value = assessment.title;
        document.getElementById('assessment-title').disabled = true;
        document.getElementById('assessment-description').value = assessment.description || '';
        document.getElementById('assessment-description').disabled = true;
        
        if (assessment.due_date) {
            document.getElementById('assessment-due-date').value = new Date(assessment.due_date).toISOString().split('T')[0];
        } else {
            document.getElementById('assessment-due-date').value = '';
        }
        document.getElementById('assessment-due-date').disabled = true;

        
        document.getElementById('assessment-max-score').value = assessment.max_score;
        document.getElementById('assessment-max-score').disabled = true;

        save.hidden=true;
        
        assessmentModal.style.display = 'block';
    }
    
    // Open edit assessment modal
    function openEditAssessmentModal(assessment) {
        modalTitle.textContent = 'Edit Assessment';
        
        // Fill form with assessment data
        document.getElementById('assessment-id').value = assessment.assessment_id;
        document.getElementById('assessment-id').disabled = false;
        document.getElementById('assessment-course').value = assessment.course_id;
        document.getElementById('assessment-course').disabled = false;
        document.getElementById('assessment-title').value = assessment.title;
        document.getElementById('assessment-title').disabled = false;
        document.getElementById('assessment-description').value = assessment.description || '';
        document.getElementById('assessment-description').disabled = false;
        
        if (assessment.due_date) {
            document.getElementById('assessment-due-date').value = new Date(assessment.due_date).toISOString().split('T')[0];
        } else {
            document.getElementById('assessment-due-date').value = '';
        }
        document.getElementById('assessment-due-date').disabled = false;

        
        document.getElementById('assessment-max-score').value = assessment.max_score;
        document.getElementById('assessment-max-score').disabled = false;

        save.hidden=false;
        
        assessmentModal.style.display = 'block';
    }
    
    // Close modal
    function closeModal() {
        assessmentModal.style.display = 'none';
    }
    
    // Add new assessment
    function addAssessment(formData) {
        fetch('/api/assessments', {
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
                fetchAssessments();
                alert('Assessment added successfully!');
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error adding assessment:', error);
            alert('An error occurred while adding the assessment.');
        });
    }
    
    // Update assessment
    function updateAssessment(assessmentId, formData) {
        fetch(`/api/assessments/${assessmentId}`, {
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
                fetchAssessments();
                alert('Assessment updated successfully!');
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error updating assessment:', error);
            alert('An error occurred while updating the assessment.');
        });
    }
    
    // Delete assessment
    function deleteAssessment(assessmentId) {
        if (confirm('Are you sure you want to delete this assessment?')) {
            fetch(`/api/assessments/${assessmentId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchAssessments();
                    alert('Assessment deleted successfully!');
                } else {
                    alert('Error: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error deleting assessment:', error);
                alert('An error occurred while deleting the assessment.');
            });
        }
    }
    
    // Search assessments
    function searchAssessments() {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (searchTerm === '') {
            renderAssessmentsTable(assessments);
            return;
        }
        
        const filteredAssessments = assessments.filter(assessment => {
            return (
                assessment.assessment_id.toString().includes(searchTerm) ||
                assessment.course_name.toLowerCase().includes(searchTerm) ||
                assessment.title.toLowerCase().includes(searchTerm) ||
                (assessment.description && assessment.description.toLowerCase().includes(searchTerm))
            );
        });
        
        renderAssessmentsTable(filteredAssessments);
    }
    
    // Event listeners
    addAssessmentBtn.addEventListener('click', openAddAssessmentModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    searchBtn.addEventListener('click', searchAssessments);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchAssessments();
        }
    });
    
    assessmentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = {
            course_id: document.getElementById('assessment-course').value,
            title: document.getElementById('assessment-title').value,
            description: document.getElementById('assessment-description').value || null,
            due_date: document.getElementById('assessment-due-date').value || null,
            max_score: document.getElementById('assessment-max-score').value
        };
        
        const assessmentId = document.getElementById('assessment-id').value;
        
        if (assessmentId) {
            updateAssessment(assessmentId, formData);
        } else {
            addAssessment(formData);
        }
    });
    
    // Initial fetch
    fetchAssessments();
    fetchCourses();
});