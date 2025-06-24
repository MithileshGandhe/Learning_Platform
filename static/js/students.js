document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const studentsTable = document.getElementById('students-table').getElementsByTagName('tbody')[0];
    const addStudentBtn = document.getElementById('add-student-btn');
    const studentModal = document.getElementById('student-modal');
    const modalTitle = document.getElementById('modal-title');
    const studentForm = document.getElementById('student-form');
    const closeBtn = studentModal.querySelector('.close-btn');
    const cancelBtn = studentModal.querySelector('.cancel-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const save = document.getElementsByClassName('submit-btn')[0];
    
    let students = [];
    let editingStudentId = null;
    
    // Fetch all students
    function fetchStudents() {
        fetch('/api/students')
            .then(response => response.json())
            .then(data => {
                students = data;
                renderStudentsTable(students);
                populateMentorDropdown();
            })
            .catch(error => {
                console.error('Error fetching students:', error);
            });
    }
    
    // Render students table
    function renderStudentsTable(studentsData) {
        studentsTable.innerHTML = '';
        
        if (studentsData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="8" class="text-center">No students found</td>';
            studentsTable.appendChild(row);
            return;
        }
        
        studentsData.forEach(student => {
            const row = document.createElement('tr');
            
            // Format dates
            const dob = student.Date_of_birth ? new Date(student.Date_of_birth).toLocaleDateString() : '-';
            const enrollmentDate = student.Enrollment_date ? new Date(student.Enrollment_date).toLocaleDateString() : '-';
            
            row.innerHTML = `
                <td>${student.Student_id}</td>
                <td>${student.Student_name}</td>
                <td>${student.Email || '-'}</td>
                <td>${dob}</td>
                <td>${enrollmentDate}</td>
                <td>${student.Major || '-'}</td>
                <td>${student.GPA || '-'}</td>
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
            viewBtn.addEventListener('click', () => openViewStudentModal(student));

            const editBtn = row.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => openEditStudentModal(student));
            
            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteStudent(student.Student_id));
            
            studentsTable.appendChild(row);
        });
    }
    
    // Populate mentor dropdown
    function populateMentorDropdown() {
        const mentorSelect = document.getElementById('student-mentor');
        mentorSelect.innerHTML = '<option value="">None</option>';
        
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.Student_id;
            option.textContent = `${student.Student_name} (ID: ${student.Student_id})`;
            mentorSelect.appendChild(option);
        });
    }
    
    // Open add student modal
    function openAddStudentModal() {
        modalTitle.textContent = 'Add Student';
        studentForm.reset();
        document.getElementById('student-id').disabled = false;
        document.getElementById('student-name').disabled = false;
        document.getElementById('student-email').disabled = false;
        document.getElementById('student-dob').disabled = false;
        document.getElementById('student-enrollment-date').disabled = false;
        document.getElementById('student-major').disabled = false;
        document.getElementById('student-gpa').disabled = false;
        document.getElementById('student-mentor').disabled = false;
        editingStudentId = null;

        save.hidden=false;

        studentModal.style.display = 'block';
    }
    

    // Open view student modal
    function openViewStudentModal(student) {
        modalTitle.textContent = 'View Student';
        
        // Fill form with student data
        document.getElementById('student-id').value = student.Student_id;
        document.getElementById('student-id').disabled = true;
        document.getElementById('student-name').value = student.Student_name;
        document.getElementById('student-name').disabled = true;
        document.getElementById('student-email').value = student.Email || '';
        document.getElementById('student-email').disabled = true;
        
        if (student.Date_of_birth) {
            document.getElementById('student-dob').value = new Date(student.Date_of_birth).toISOString().split('T')[0];
        } else {
            document.getElementById('student-dob').value = '';
        }
        document.getElementById('student-dob').disabled = true;
        
        if (student.Enrollment_date) {
            document.getElementById('student-enrollment-date').value = new Date(student.Enrollment_date).toISOString().split('T')[0];
        } else {
            document.getElementById('student-enrollment-date').value = '';
        }
        document.getElementById('student-enrollment-date').disabled = true;
        
        document.getElementById('student-major').value = student.Major || '';
        document.getElementById('student-major').disabled = true;
        document.getElementById('student-gpa').value = student.GPA || '';
        document.getElementById('student-gpa').disabled = true;
        document.getElementById('student-mentor').value = student.mentor_id || '';
        document.getElementById('student-mentor').disabled = true;

        save.hidden=true;
        
        editingStudentId = student.Student_id;
        studentModal.style.display = 'block';
    }


    // Open edit student modal
    function openEditStudentModal(student) {
        modalTitle.textContent = 'Edit Student';
        
        // Fill form with student data
        document.getElementById('student-id').value = student.Student_id;
        document.getElementById('student-id').disabled = true;
        document.getElementById('student-name').disabled = false;
        document.getElementById('student-name').value = student.Student_name;
        document.getElementById('student-email').disabled = false;
        document.getElementById('student-email').value = student.Email || '';
        
        document.getElementById('student-dob').disabled = false;
        if (student.Date_of_birth) {
            document.getElementById('student-dob').value = new Date(student.Date_of_birth).toISOString().split('T')[0];
        } else {
            document.getElementById('student-dob').value = '';
        }
        
        document.getElementById('student-enrollment-date').disabled = false;
        if (student.Enrollment_date) {
            document.getElementById('student-enrollment-date').value = new Date(student.Enrollment_date).toISOString().split('T')[0];
        } else {
            document.getElementById('student-enrollment-date').value = '';
        }
        
        document.getElementById('student-major').disabled = false;
        document.getElementById('student-major').value = student.Major || '';
        document.getElementById('student-gpa').disabled = false;
        document.getElementById('student-gpa').value = student.GPA || '';
        document.getElementById('student-mentor').disabled = false;
        document.getElementById('student-mentor').value = student.mentor_id || '';

        save.hidden=false;
        
        editingStudentId = student.Student_id;
        studentModal.style.display = 'block';
    }
    
    // Close modal
    function closeModal() {
        studentModal.style.display = 'none';
    }
    
    // Add new student
    function addStudent(formData) {
        fetch('/api/students', {
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
                fetchStudents();
                alert('Student added successfully!');
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error adding student:', error);
            alert('An error occurred while adding the student.');
        });
    }
    
    // Update student
    function updateStudent(studentId, formData) {
        fetch(`/api/students/${studentId}`, {
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
                fetchStudents();
                alert('Student updated successfully!');
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error updating student:', error);
            alert('An error occurred while updating the student.');
        });
    }
    
    // Delete student
    function deleteStudent(studentId) {
        if (confirm('Are you sure you want to delete this student?')) {
            fetch(`/api/students/${studentId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchStudents();
                    alert('Student deleted successfully!');
                } else {
                    alert('Error: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error deleting student:', error);
                alert('An error occurred while deleting the student.');
            });
        }
    }
    
    // Search students
    function searchStudents() {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (searchTerm === '') {
            renderStudentsTable(students);
            return;
        }
        
        const filteredStudents = students.filter(student => {
            return (
                student.Student_id.toString().includes(searchTerm) ||
                student.Student_name.toLowerCase().includes(searchTerm) ||
                (student.Email && student.Email.toLowerCase().includes(searchTerm)) ||
                (student.Major && student.Major.toLowerCase().includes(searchTerm))
            );
        });
        
        renderStudentsTable(filteredStudents);
    }
    
    // Event listeners
    addStudentBtn.addEventListener('click', openAddStudentModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    searchBtn.addEventListener('click', searchStudents);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchStudents();
        }
    });
    
    studentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = {
            student_id: document.getElementById('student-id').value,
            student_name: document.getElementById('student-name').value,
            email: document.getElementById('student-email').value || null,
            date_of_birth: document.getElementById('student-dob').value || null,
            enrollment_date: document.getElementById('student-enrollment-date').value,
            major: document.getElementById('student-major').value || null,
            gpa: document.getElementById('student-gpa').value || null,
            mentor_id: document.getElementById('student-mentor').value || null
        };
        
        if (editingStudentId) {
            updateStudent(editingStudentId, formData);
        } else {
            addStudent(formData);
        }
    });
    
    // Initial fetch
    fetchStudents();
});