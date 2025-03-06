export const generateUsername = (firstName, lastName, grade) => {
  return `${firstName.trim()}${lastName.trim()}${grade.trim()}`
}