document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const instructorsTable = document.getElementById('instructors-table').getElementsByTagName('tbody')[0];
    const addInstructorBtn = document.getElementById('add-instructor-btn');
    const instructorModal = document.getElementById('instructor-modal');
    const modalTitle = document.getElementById('modal-title');
    const instructorForm = document.getElementById('instructor-form');
    const closeBtn = instructorModal.querySelector('.close-btn');
    const cancelBtn = instructorModal.querySelector('.cancel-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const save = document.getElementsByClassName('submit-btn')[0];
    
    let instructors = [];
    
    // Fetch all instructors
    function fetchInstructors() {
        fetch('/api/instructors')
            .then(response => response.json())
            .then(data => {
                instructors = data;
                renderInstructorsTable(instructors);
            })
            .catch(error => {
                console.error('Error fetching instructors:', error);
            });
    }
    
    // Render instructors table
    function renderInstructorsTable(instructorsData) {
        instructorsTable.innerHTML = '';
        
        if (instructorsData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" class="text-center">No instructors found</td>';
            instructorsTable.appendChild(row);
            return;
        }
        
        instructorsData.forEach(instructor => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${instructor.instructor_id}</td>
                <td>${instructor.first_name}</td>
                <td>${instructor.last_name}</td>
                <td>${instructor.email}</td>
                <td>${instructor.specialization}</td>
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
            viewBtn.addEventListener('click', () => openViewInstructorModal(instructor));

            const editBtn = row.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => openEditInstructorModal(instructor));
            
            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteInstructor(instructor.instructor_id));
            
            instructorsTable.appendChild(row);
        });
    }
    
    // Open add instructor modal
    function openAddInstructorModal() {
            
        document.getElementById('instructor-id').disabled = false;
        document.getElementById('instructor-first-name').disabled = false;
        document.getElementById('instructor-last-name').disabled = false;
        document.getElementById('instructor-email').disabled = false;
        document.getElementById('instructor-specialization').disabled = false;
        document.getElementById('instructor-bio').disabled = false;

        save.hidden=false;

        modalTitle.textContent = 'Add Instructor';
        instructorForm.reset();
        document.getElementById('instructor-id').value = '';
        instructorModal.style.display = 'block';
    }

    // Open view instructor modal
    function openViewInstructorModal(instructor) {

        document.getElementById('instructor-id').disabled = true;
        document.getElementById('instructor-first-name').disabled = true;
        document.getElementById('instructor-last-name').disabled = true;
        document.getElementById('instructor-email').disabled = true;
        document.getElementById('instructor-specialization').disabled = true;
        document.getElementById('instructor-bio').disabled = true;

        save.hidden=true;

        modalTitle.textContent = 'View Instructor';
        
        // Fill form with instructor data
        document.getElementById('instructor-id').value = instructor.instructor_id;
        document.getElementById('instructor-first-name').value = instructor.first_name;
        document.getElementById('instructor-last-name').value = instructor.last_name;
        document.getElementById('instructor-email').value = instructor.email;
        document.getElementById('instructor-specialization').value = instructor.specialization;
        document.getElementById('instructor-bio').value = instructor.bio || '';
        
        instructorModal.style.display = 'block';
    }
    
    // Open edit instructor modal
    function openEditInstructorModal(instructor) {
        
        document.getElementById('instructor-id').disabled = false;
        document.getElementById('instructor-first-name').disabled = false;
        document.getElementById('instructor-last-name').disabled = false;
        document.getElementById('instructor-email').disabled = false;
        document.getElementById('instructor-specialization').disabled = false;
        document.getElementById('instructor-bio').disabled = false;

        save.hidden=false;

        modalTitle.textContent = 'Edit Instructor';
        
        // Fill form with instructor data
        document.getElementById('instructor-id').value = instructor.instructor_id;
        document.getElementById('instructor-first-name').value = instructor.first_name;
        document.getElementById('instructor-last-name').value = instructor.last_name;
        document.getElementById('instructor-email').value = instructor.email;
        document.getElementById('instructor-specialization').value = instructor.specialization;
        document.getElementById('instructor-bio').value = instructor.bio || '';
        
        instructorModal.style.display = 'block';
    }
    
    // Close modal
    function closeModal() {
        instructorModal.style.display = 'none';
    }
    
    // Add new instructor
    function addInstructor(formData) {
        fetch('/api/instructors', {
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
                fetchInstructors();
                alert('Instructor added successfully!');
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error adding instructor:', error);
            alert('An error occurred while adding the instructor.');
        });
    }
    
    // Update instructor
    function updateInstructor(instructorId, formData) {
        fetch(`/api/instructors/${instructorId}`, {
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
                fetchInstructors();
                alert('Instructor updated successfully!');
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error updating instructor:', error);
            alert('An error occurred while updating the instructor.');
        });
    }
    
    // Delete instructor
    function deleteInstructor(instructorId) {
        if (confirm('Are you sure you want to delete this instructor?')) {
            fetch(`/api/instructors/${instructorId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchInstructors();
                    alert('Instructor deleted successfully!');
                } else {
                    alert('Error: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error deleting instructor:', error);
                alert('An error occurred while deleting the instructor.');
            });
        }
    }
    
    // Search instructors
    function searchInstructors() {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (searchTerm === '') {
            renderInstructorsTable(instructors);
            return;
        }
        
        const filteredInstructors = instructors.filter(instructor => {
            return (
                instructor.instructor_id.toString().includes(searchTerm) ||
                instructor.first_name.toLowerCase().includes(searchTerm) ||
                instructor.last_name.toLowerCase().includes(searchTerm) ||
                instructor.email.toLowerCase().includes(searchTerm) ||
                instructor.specialization.toLowerCase().includes(searchTerm)
            );
        });
        
        renderInstructorsTable(filteredInstructors);
    }
    
    // Event listeners
    addInstructorBtn.addEventListener('click', openAddInstructorModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    searchBtn.addEventListener('click', searchInstructors);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchInstructors();
        }
    });
    
    instructorForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = {
            first_name: document.getElementById('instructor-first-name').value,
            last_name: document.getElementById('instructor-last-name').value,
            email: document.getElementById('instructor-email').value,
            specialization: document.getElementById('instructor-specialization').value,
            bio: document.getElementById('instructor-bio').value || null
        };
        
        const instructorId = document.getElementById('instructor-id').value;
        
        if (instructorId) {
            updateInstructor(instructorId, formData);
        } else {
            addInstructor(formData);
        }
    });
    
    // Initial fetch
    fetchInstructors();
});