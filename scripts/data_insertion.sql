INSERT INTO Instructors (first_name, last_name, email, bio, specialization)
VALUES
('Ravi', 'Kumar', 'ravi.kumar@university.in', '10+ years of experience in AI and ML.', 'Artificial Intelligence'),
('Priya', 'Sharma', 'priya.sharma@university.in', 'Web technologies expert with passion for teaching.', 'Web Development'),
('Amit', 'Verma', 'amit.verma@university.in', 'Focused on systems programming and OS concepts.', 'Operating Systems');

INSERT INTO Courses (course_name, description, instructor_id, start_date, end_date, category)
VALUES
('Introduction to Python', 'Basics of Python programming for beginners.', 4, '2025-01-10', '2025-04-20', 'Programming'),
('Web Development with JavaScript', 'Frontend and backend development using JS.', 2, '2025-02-01', '2025-05-30', 'Web Development'),
('Operating Systems', 'In-depth concepts of processes, memory, and file systems.', 3, '2025-01-15', '2025-04-25', 'Systems');

INSERT INTO Students (Student_id, Student_name, Email, Date_of_birth, Enrollment_date, Major, GPA, mentor_id)
VALUES
(101, 'Anjali Mehta', 'anjali.mehta@student.in', '2003-05-14', '2025-01-05', 'Computer Science', 3.7, NULL),
(102, 'Rahul Deshmukh', 'rahul.deshmukh@student.in', '2002-11-21', '2025-01-06', 'Computer Engineering', 3.2, 101),
(103, 'Sneha Joshi', 'sneha.joshi@student.in', '2003-07-30', '2025-01-06', 'Information Technology', 3.9, NULL);

INSERT INTO Enrollment (Enrollment_id, Student_id, Course_id, Enrollment_date, Status, Grade)
VALUES
(1, 101, 16, '2025-01-07', 'Active', NULL),
(2, 101, 17, '2025-01-10', 'Completed', 'A'),
(3, 102, 17, '2025-01-11', 'Active', NULL),
(4, 103, 18, '2025-01-12', 'Active', NULL);

INSERT INTO Assessments (course_id, title, description, due_date, max_score)
VALUES
(16, 'Python Basics Quiz', 'Covers variables, loops, and conditions.', '2025-02-15', 20),
(17, 'HTML/CSS Assignment', 'Build a static website layout.', '2025-03-05', 30),
(18, 'Process Management Quiz', 'Topics include process scheduling and deadlocks.', '2025-03-10', 25),
(17, 'Node.js Project', 'Backend REST API development using Node.js.', '2025-04-01', 40);

SET SQL_SAFE_UPDATES = 0;

ALTER TABLE Students
DROP CHECK students_chk_1;

UPDATE Students
SET GPA = LEAST(GPA * 2.5, 10.0)
WHERE GPA IS NOT NULL;

SET SQL_SAFE_UPDATES = 1;  -- optional: re-enable it

select * from instructors;
select * from students;
select * from courses;
select * from enrollments;
select * from assessments;