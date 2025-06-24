create database Learning_Platform;
use Learning_Platform;


CREATE TABLE Students (
    Student_id INT PRIMARY KEY,
    Student_name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    Date_of_birth DATE,
    Enrollment_date DATE NOT NULL,
    Major VARCHAR(50),
    GPA DECIMAL(3,2) CHECK (GPA BETWEEN 0 AND 4.0),
    mentor_id INT NULL,
    FOREIGN KEY (mentor_id) REFERENCES Students(Student_id)
);

CREATE TABLE Instructors (
    instructor_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    bio TEXT,
    specialization VARCHAR(100) not NULL
);

create table courses (
	course_id int primary key auto_increment,
    course_name varchar(255) not null,
    description text,
    instructor_id int,
    start_date date,
    end_date date,
    category varchar(100),
    FOREIGN KEY (Instructor_id) REFERENCES Instructors(Instructor_id)
);


CREATE TABLE Enrollment (
    Enrollment_id INT PRIMARY KEY,
    Student_id INT NOT NULL,
    Course_id INT NOT NULL,
    Enrollment_date DATE NOT NULL,
    Status VARCHAR(20) NOT NULL CHECK (Status IN ('Active', 'Dropped', 'Completed', 'Waitlisted')),
    Grade VARCHAR(2),
    FOREIGN KEY (Student_id) REFERENCES Students(Student_id),
    FOREIGN KEY (Course_id) REFERENCES Courses(Course_id)
);


create table assessments (
	assessment_id int primary key auto_increment,
    course_id int not null,
    title varchar(255) not null,
    description text,
    due_date date,
    max_score int,
    FOREIGN KEY (Course_id) REFERENCES Courses(Course_id)
);

ALTER TABLE Students
MODIFY GPA DECIMAL(4,2) CHECK (GPA BETWEEN 0 AND 10.0);

