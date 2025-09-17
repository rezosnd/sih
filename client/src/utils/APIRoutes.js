export const host = "http://localhost:8000";

export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;

export const addTeacherRoute = `${host}/api/auth/teacher/add_teacher`;
export const getAllTeacherRoute = `${host}/api/auth/teacher/get_all_teacher`;
export const updateTeacherRoute = `${host}/api/auth/teacher/update_teacher`;
export const deleteTeacherRoute = `${host}/api/auth/teacher/remove_teacher`;
export const getTeacherByIDRoute = `${host}/api/auth/teacher/get_teacher_byID`;

export const addStudentRoute = `${host}/api/auth/student/add_student`;
export const getAllStudentRoute = `${host}/api/auth/student/get_all_student`;
export const updateStudentRoute = `${host}/api/auth/student/update_student`;
export const deleteStudentRoute = `${host}/api/auth/student/remove_student`;
export const getStudentByIDRoute = `${host}/api/auth/student/get_student_byID`;
export const getStudentByComputerCode = `${host}/api/auth/student/get_student_by_computer_code`;

