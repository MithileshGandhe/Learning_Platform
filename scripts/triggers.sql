use learning_platform;

CREATE TABLE Deleted_Students (
    Student_id INT,
    Student_name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    Date_of_birth DATE,
    Enrollment_date DATE NOT NULL,
    Major VARCHAR(50),
    GPA DECIMAL(4,2) CHECK (GPA BETWEEN 0 AND 10.0),
    mentor_id INT NULL,
    deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
DELIMITER //
CREATE TRIGGER after_student_delete
AFTER DELETE ON Students
FOR EACH ROW
BEGIN
    INSERT INTO Deleted_Students (Student_id, Student_name, Email, Date_of_birth, Enrollment_date, Major, GPA, mentor_id)
    VALUES (OLD.student_id, OLD.student_name, OLD.email, OLD.Date_of_birth,OLD.Enrollment_date,OLD.Major, OLD.GPA, OLD.mentor_id);
END //
DELIMITER ;



CREATE TABLE Deleted_Instructors (
    instructor_id INT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    bio TEXT,
    specialization VARCHAR(100) not NULL,
    deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
DELIMITER //
CREATE TRIGGER after_instructor_delete
AFTER DELETE ON Instructors
FOR EACH ROW
BEGIN
    INSERT INTO Deleted_Instructors (instructor_id,first_name, last_name, email, bio, specialization)
    VALUES (OLD.instructor_id, OLD.first_name,OLD.last_name, OLD.email, OLD.bio ,OLD.specialization);
END //
DELIMITER ;


create table Deleted_Courses (
	course_id int,
    course_name varchar(255) not null,
    description text,
    instructor_id int,
    start_date date,
    end_date date,
    category varchar(100),
    deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
DELIMITER //
CREATE TRIGGER after_course_delete
AFTER DELETE ON courses
FOR EACH ROW
BEGIN
    INSERT INTO Deleted_Courses (course_id,course_name, description, instructor_id, start_date, end_date, category)
    VALUES (OLD.course_id, OLD.course_name,OLD.description, OLD.instructor_id, OLD.start_date ,OLD.end_date, OLD.category);
END //
DELIMITER ;


CREATE TABLE Deleted_Enrollment (
    Enrollment_id INT ,
    Student_id INT NOT NULL,
    Course_id INT NOT NULL,
    Enrollment_date DATE NOT NULL,
    Status VARCHAR(20) NOT NULL CHECK (Status IN ('Active', 'Dropped', 'Completed', 'Waitlisted')),
    Grade VARCHAR(2),
    deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
DELIMITER //
CREATE TRIGGER after_enrollment_delete
AFTER DELETE ON enrollment
FOR EACH ROW
BEGIN
    INSERT INTO Deleted_enrollment (Enrollment_id, Student_id, Course_id, Enrollment_date, Status, Grade)
    VALUES (OLD.enrollment_id, OLD.student_id,OLD.course_id, OLD.enrollment_date,OLD.status, OLD.grade);
END //
DELIMITER ;


create table Deleted_assessments (
	assessment_id int,
    course_id int not null,
    title varchar(255) not null,
    description text,
    due_date date,
    max_score int,
    deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
DELIMITER //
CREATE TRIGGER after_assessment_delete
AFTER DELETE ON assessments
FOR EACH ROW
BEGIN
    INSERT INTO Deleted_Assessments (assessment_id,course_id, title, description, due_date, max_score)
    VALUES (OLD.assessment_id, OLD.course_id,OLD.title, OLD.description, OLD.due_date,OLD.max_score);
END //
DELIMITER ;

select * from deleted_students;
select * from deleted_instructors;
select * from deleted_courses;
select * from deleted_enrollment;
select * from deleted_assessments;
