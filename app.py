from flask import Flask, render_template, request, jsonify
import mysql.connector
from mysql.connector import Error
import json
from datetime import datetime, date


app = Flask(__name__)

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'database': 'learning_platform',
    'user': 'root',
    'password': 'mithilesh'
}

# Helper function to connect to the database
def get_db_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# Helper function to convert date objects to strings for JSON serialization
def json_serial(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

# Routes for the main pages
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/students')
def students():
    return render_template('students.html')

@app.route('/instructors')
def instructors():
    return render_template('instructors.html')

@app.route('/courses')
def courses():
    return render_template('courses.html')

@app.route('/enrollments')
def enrollments():
    return render_template('enrollments.html')

@app.route('/assessments')
def assessments():
    return render_template('assessments.html')

# API Routes for Students
@app.route('/api/students', methods=['GET'])
def get_students():
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Students")
            students = cursor.fetchall()
            cursor.close()
            conn.close()
            return json.dumps(students, indent=4, sort_keys=True, default=str)
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/students', methods=['POST'])
def add_student():
    data = request.json
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "CALL AddStudent(%s, %s, %s, %s, %s, %s, %s, %s)"
            values = (
                data.get('student_id'),
                data.get('student_name'),
                data.get('email'),
                data.get('date_of_birth'),
                data.get('enrollment_date'),
                data.get('major'),
                data.get('gpa'),
                data.get('mentor_id')
            )
            cursor.execute(query, values)
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"success": True, "message": "Student added successfully"})
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    data = request.json
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "CALL UpdateStudent(%s,%s,%s,%s,%s,%s,%s,%s)"
            values = (
                data.get('student_name'),
                data.get('email'),
                data.get('date_of_birth'),
                data.get('enrollment_date'),
                data.get('major'),
                data.get('gpa'),
                data.get('mentor_id'),
                student_id
            )
            cursor.execute(query, values)
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"success": True, "message": "Student updated successfully"})
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("CALL DeleteStudent(%s)", (student_id,))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"success": True, "message": "Student deleted successfully"})
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

# API Routes for Instructors
@app.route('/api/instructors', methods=['GET'])
def get_instructors():
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Instructors")
            instructors = cursor.fetchall()
            cursor.close()
            conn.close()
            return json.dumps(instructors, default=json_serial)
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/instructors', methods=['POST'])
def add_instructor():
    data = request.json
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = """
            INSERT INTO Instructors (first_name, last_name, email, bio, specialization)
            VALUES (%s, %s, %s, %s, %s)
            """
            values = (
                data.get('first_name'),
                data.get('last_name'),
                data.get('email'),
                data.get('bio'),
                data.get('specialization')
            )
            cursor.execute(query, values)
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"success": True, "message": "Instructor added successfully"})
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/instructors/<int:instructor_id>', methods=['PUT'])
def update_instructor(instructor_id):
    data = request.json
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = """
            UPDATE Instructors
            SET first_name = %s, last_name = %s, email = %s, bio = %s, specialization = %s
            WHERE instructor_id = %s
            """
            values = (
                data.get('first_name'),
                data.get('last_name'),
                data.get('email'),
                data.get('bio'),
                data.get('specialization'),
                instructor_id
            )
            cursor.execute(query, values)
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"success": True, "message": "Instructor updated successfully"})
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/instructors/<int:instructor_id>', methods=['DELETE'])
def delete_instructor(instructor_id):
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM Instructors WHERE instructor_id = %s", (instructor_id,))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"success": True, "message": "Instructor deleted successfully"})
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

# API Routes for Courses
@app.route('/api/courses', methods=['GET'])
def get_courses():
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT c.*, CONCAT(i.first_name, ' ', i.last_name) as instructor_name
                FROM courses c
                LEFT JOIN instructors i ON c.instructor_id = i.instructor_id
            """)
            courses = cursor.fetchall()
            cursor.close()
            conn.close()
            return json.dumps(courses, default=json_serial)
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/courses', methods=['POST'])
def add_course():
    data = request.json
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = """
            INSERT INTO courses (course_name, description, instructor_id, start_date, end_date, category)
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            values = (
                data.get('course_name'),
                data.get('description'),
                data.get('instructor_id'),
                data.get('start_date'),
                data.get('end_date'),
                data.get('category')
            )
            cursor.execute(query, values)
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"success": True, "message": "Course added successfully"})
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/courses/<int:course_id>', methods=['PUT'])
def update_course(course_id):
    data = request.json
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = """
            UPDATE courses
            SET course_name = %s, description = %s, instructor_id = %s, 
                start_date = %s, end_date = %s, category = %s
            WHERE course_id = %s
            """
            values = (
                data.get('course_name'),
                data.get('description'),
                data.get('instructor_id'),
                data.get('start_date'),
                data.get('end_date'),
                data.get('category'),
                course_id
            )
            cursor.execute(query, values)
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"success": True, "message": "Course updated successfully"})
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM courses WHERE course_id = %s", (course_id,))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"success": True, "message": "Course deleted successfully"})
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

# API Routes for Enrollments
@app.route('/api/enrollments', methods=['GET'])
def get_enrollments():
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT e.*, s.Student_name, c.course_name
                FROM Enrollment e
                JOIN Students s ON e.Student_id = s.Student_id
                JOIN courses c ON e.Course_id = c.course_id
            """)
            enrollments = cursor.fetchall()
            cursor.close()
            conn.close()
            return json.dumps(enrollments, default=json_serial)
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/enrollments', methods=['POST'])
def add_enrollment():
    data = request.json
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = """
            INSERT INTO Enrollment (Enrollment_id, Student_id, Course_id, Enrollment_date, Status, Grade)
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            values = (
                data.get('enrollment_id'),
                data.get('student_id'),
                data.get('course_id'),
                data.get('enrollment_date'),
                data.get('status'),
                data.get('grade')
            )
            cursor.execute(query, values)
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"success": True, "message": "Enrollment added successfully"})
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/enrollments/<int:enrollment_id>', methods=['PUT'])
def update_enrollment(enrollment_id):
    data = request.json
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = """
            UPDATE Enrollment
            SET Student_id = %s, Course_id = %s, Enrollment_date = %s, Status = %s, Grade = %s
            WHERE Enrollment_id = %s
            """
            values = (
                data.get('student_id'),
                data.get('course_id'),
                data.get('enrollment_date'),
                data.get('status'),
                data.get('grade'),
                enrollment_id
            )
            cursor.execute(query, values)
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"success": True, "message": "Enrollment updated successfully"})
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/enrollments/<int:enrollment_id>', methods=['DELETE'])
def delete_enrollment(enrollment_id):
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM Enrollment WHERE Enrollment_id = %s", (enrollment_id,))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"success": True, "message": "Enrollment deleted successfully"})
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

# API Routes for Assessments
@app.route('/api/assessments', methods=['GET'])
def get_assessments():
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT a.*, c.course_name
                FROM assessments a
                JOIN courses c ON a.course_id = c.course_id
            """)
            assessments = cursor.fetchall()
            cursor.close()
            conn.close()
            return json.dumps(assessments, default=json_serial)
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/assessments', methods=['POST'])
def add_assessment():
    data = request.json
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = """
            INSERT INTO assessments (course_id, title, description, due_date, max_score)
            VALUES (%s, %s, %s, %s, %s)
            """
            values = (
                data.get('course_id'),
                data.get('title'),
                data.get('description'),
                data.get('due_date'),
                data.get('max_score')
            )
            cursor.execute(query, values)
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"success": True, "message": "Assessment added successfully"})
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/assessments/<int:assessment_id>', methods=['PUT'])
def update_assessment(assessment_id):
    data = request.json
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = """
            UPDATE assessments
            SET course_id = %s, title = %s, description = %s, due_date = %s, max_score = %s
            WHERE assessment_id = %s
            """
            values = (
                data.get('course_id'),
                data.get('title'),
                data.get('description'),
                data.get('due_date'),
                data.get('max_score'),
                assessment_id
            )
            cursor.execute(query, values)
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"success": True, "message": "Assessment updated successfully"})
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/assessments/<int:assessment_id>', methods=['DELETE'])
def delete_assessment(assessment_id):
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM assessments WHERE assessment_id = %s", (assessment_id,))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"success": True, "message": "Assessment deleted successfully"})
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

# Get data for dashboard
@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            
            # Get counts
            cursor.execute("SELECT COUNT(*) as student_count FROM Students")
            student_count = cursor.fetchone()['student_count']
            
            cursor.execute("SELECT COUNT(*) as instructor_count FROM Instructors")
            instructor_count = cursor.fetchone()['instructor_count']
            
            cursor.execute("SELECT COUNT(*) as course_count FROM courses")
            course_count = cursor.fetchone()['course_count']
            
            cursor.execute("SELECT COUNT(*) as enrollment_count FROM Enrollment")
            enrollment_count = cursor.fetchone()['enrollment_count']
            
            cursor.execute("SELECT COUNT(*) as assessment_count FROM assessments")
            assessment_count = cursor.fetchone()['assessment_count']
            
            # Get recent enrollments
            cursor.execute("""
                SELECT e.Enrollment_date, s.Student_name, c.course_name
                FROM Enrollment e
                JOIN Students s ON e.Student_id = s.Student_id
                JOIN courses c ON e.Course_id = c.course_id
                ORDER BY e.Enrollment_date DESC
                LIMIT 5
            """)
            recent_enrollments = cursor.fetchall()
            
            # Get upcoming assessments
            cursor.execute("""
                SELECT a.title, a.due_date, c.course_name
                FROM assessments a
                JOIN courses c ON a.course_id = c.course_id
                WHERE a.due_date >= CURDATE()
                ORDER BY a.due_date ASC
                LIMIT 5
            """)
            upcoming_assessments = cursor.fetchall()
            
            cursor.close()
            conn.close()
            
            dashboard_data = {
                "counts": {
                    "students": student_count,
                    "instructors": instructor_count,
                    "courses": course_count,
                    "enrollments": enrollment_count,
                    "assessments": assessment_count
                },
                "recent_enrollments": recent_enrollments,
                "upcoming_assessments": upcoming_assessments
            }
            
            return json.dumps(dashboard_data, default=json_serial)
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/logs')
def logs():
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            log_tables = {
                "Deleted Students": "Deleted_Students",
                "Deleted Instructors": "Deleted_Instructors",
                "Deleted Courses": "Deleted_Courses",
                "Deleted Enrollments": "Deleted_Enrollment",
                "Deleted Assessments": "Deleted_Assessments"
            }
            logs = {}
            for title, table in log_tables.items():
                cursor.execute(f"SELECT * FROM {table} ORDER BY deleted_at DESC")
                logs[title] = cursor.fetchall() or [{}]
            cursor.close()
            conn.close()
            return render_template("logs.html", logs=logs)
        except Error as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database connection failed"}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0",debug=True)