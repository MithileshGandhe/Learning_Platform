use learning_platform;


DELIMITER //
CREATE PROCEDURE AddStudent (
    IN p_Student_id INT,
    IN p_Student_name VARCHAR(100),
    IN p_Email VARCHAR(100),
    IN p_Date_of_birth DATE,
    IN p_Enrollment_date DATE,
    IN p_Major VARCHAR(50),
    IN p_GPA DECIMAL(4,2),
    IN p_mentor_id INT
)
BEGIN
    INSERT INTO Students (Student_id, Student_name, Email, Date_of_birth, Enrollment_date, Major, GPA, mentor_id)
    VALUES (p_Student_id, p_Student_name, p_Email, p_Date_of_birth, p_Enrollment_date, p_Major, p_GPA, p_mentor_id);
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE DeleteStudent (IN p_Student_id INT)
BEGIN
    DELETE FROM Students WHERE Student_id = p_Student_id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE UpdateStudent (
    IN p_Student_name VARCHAR(100),
    IN p_Email VARCHAR(100),
    IN p_Date_of_birth DATE,
    IN p_Enrollment_date DATE,
    IN p_Major VARCHAR(50),
    IN p_GPA DECIMAL(3,2),
    IN p_mentor_id INT,
    IN p_Student_id INT
)
BEGIN
    UPDATE Students
    SET Student_name = p_Student_name,
        Email = p_Email,
        Date_of_birth = p_Date_of_birth,
        Enrollment_date = p_Enrollment_date,
        Major = p_Major,
        GPA = p_GPA,
        mentor_id = p_mentor_id
    WHERE Student_id = p_Student_id;
END //
DELIMITER ;
